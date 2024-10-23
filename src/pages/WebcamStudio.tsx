
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from "@/components/shadcn/ui/button";
import { Camera, Video, Square, Download, Wifi, Monitor } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { useAppContext } from '@/contexts/AppContext';
import { useQuery } from 'react-query';
import { getSubscriptionStatus } from '@/utils/api-client';

const WebcamStudio: React.FC = () => {
  const [isWebcamOn, setIsWebcamOn] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const peerConnectionsRef = useRef<{ [id: string]: RTCPeerConnection }>({});
  const socketRef = useRef<Socket | null>(null);
  const { user } = useAppContext();

  const { data: subscriptionStatus } = useQuery(
    ["subscriptionStatus", user?.email],
    () => getSubscriptionStatus(user?.email || ""),
    {
      enabled: !!user?.email,
    }
  );

  useEffect(() => {
    socketRef.current = io('http://localhost:3000', {
      transports: ['websocket'],
      upgrade: false
    });

    socketRef.current.on('connect', () => {
      console.log('Connected to server');
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setError(`Failed to connect to server: ${error.message}`);
    });

    socketRef.current.on('watcher', (id: string) => {
      console.log('New watcher:', id);
      const peerConnection = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      });
      peerConnectionsRef.current[id] = peerConnection;

      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => {
          peerConnection.addTrack(track, streamRef.current!);
        });
      }

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socketRef.current?.emit('candidate', id, event.candidate);
        }
      };

      peerConnection
        .createOffer()
        .then(sdp => peerConnection.setLocalDescription(sdp))
        .then(() => {
          if (peerConnection.localDescription) {
            socketRef.current?.emit('offer', id, peerConnection.localDescription);
          }
        })
        .catch(error => console.error(`Error creating offer:`, error));
    });

    socketRef.current.on('answer', (id: string, description: RTCSessionDescriptionInit) => {
      peerConnectionsRef.current[id]?.setRemoteDescription(new RTCSessionDescription(description))
        .catch(error => console.error(`Error setting remote description:`, error));
    });

    socketRef.current.on('candidate', (id: string, candidate: RTCIceCandidateInit) => {
      peerConnectionsRef.current[id]?.addIceCandidate(new RTCIceCandidate(candidate))
        .catch(error => console.error(`Error adding ICE candidate:`, error));
    });

    socketRef.current.on('disconnectPeer', (id: string) => {
      if (peerConnectionsRef.current[id]) {
        peerConnectionsRef.current[id].close();
        delete peerConnectionsRef.current[id];
      }
    });

    return () => {
      stopWebcam();
      socketRef.current?.disconnect();
    };
  }, []);

  const startWebcam = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsWebcamOn(true);
        setError(null);
      }
    } catch (err) {
      console.error("Error accessing the webcam:", err);
      setError("Failed to access the webcam. Please make sure it's connected and you've granted permission.");
    }
  }, []);

  const stopWebcam = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsWebcamOn(false);
    setIsStreaming(false);
    socketRef.current?.emit('stopBroadcasting');
  }, []);

  const captureScreenshot = useCallback(() => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
      const imageDataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imageDataUrl;
      link.download = 'webcam-screenshot.png';
      link.click();
    }
  }, []);

  const startRecording = useCallback(() => {
    if (streamRef.current) {
      const mediaRecorder = new MediaRecorder(streamRef.current);
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks((prev) => [...prev, event.data]);
        }
      };
      mediaRecorder.start();
      setIsRecording(true);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, []);

  const downloadRecording = useCallback(() => {
    if (recordedChunks.length > 0) {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'webcam-recording.webm';
      link.click();
      URL.revokeObjectURL(url);
      setRecordedChunks([]);
    }
  }, [recordedChunks]);

  const startStreaming = useCallback(() => {
    if (isWebcamOn && streamRef.current && streamRef.current.active) {
      socketRef.current?.emit('startBroadcasting');
      setIsStreaming(true);
    } else {
      setError("Please ensure the webcam is started and the stream is active before streaming.");
    }
  }, [isWebcamOn]);

  const stopStreaming = useCallback(() => {
    setIsStreaming(false);
    Object.keys(peerConnectionsRef.current).forEach((id) => {
      peerConnectionsRef.current[id].close();
      delete peerConnectionsRef.current[id];
    });
    socketRef.current?.emit('stopBroadcasting');
  }, []);

  const startScreenShare = useCallback(async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = screenStream;
        streamRef.current = screenStream;
        setIsScreenSharing(true);
        setError(null);
      }
    } catch (err) {
      console.error("Error accessing screen share:", err);
      setError("Failed to start screen sharing. Please make sure you've granted permission.");
    }
  }, []);

  const stopScreenShare = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsScreenSharing(false);
  }, []);

  return (
    <div className="min-h-screen p-8">
      {subscriptionStatus?.status == "active" &&
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8">
          <h1 className="text-4xl font-bold mb-6 text-indigo-800">Webcam Studio</h1>
          
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          )}
          
          <div className="mb-6 flex flex-wrap items-center gap-4">
            <Button 
              onClick={isWebcamOn ? stopWebcam : startWebcam}
              className={`${isWebcamOn ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white`}
            >
              <Camera className="mr-2 h-4 w-4" />
              {isWebcamOn ? 'Stop Webcam' : 'Start Webcam'}
            </Button>

            <Button 
              onClick={isScreenSharing ? stopScreenShare : startScreenShare} 
              className={`${isScreenSharing ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white`}
            >
              <Monitor className="mr-2 h-4 w-4" />
              {isScreenSharing ? 'Stop Screen Share' : 'Start Screen Share'}
            </Button>
            
            <Button 
              onClick={captureScreenshot} 
              disabled={!isWebcamOn && !isScreenSharing}
              className="bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50"
            >
              <Camera className="mr-2 h-4 w-4" />
              Capture Screenshot
            </Button>
            
            <Button 
              onClick={isRecording ? stopRecording : startRecording} 
              disabled={!isWebcamOn && !isScreenSharing}
              className={`${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'} text-white disabled:opacity-50`}
            >
              {isRecording ? <Square className="mr-2 h-4 w-4" /> : <Video className="mr-2 h-4 w-4" />}
              {isRecording ? 'Stop Recording' : 'Start Recording'}
            </Button>
            
            <Button 
              onClick={downloadRecording} 
              disabled={recordedChunks.length === 0}
              className="bg-purple-500 hover:bg-purple-600 text-white disabled:opacity-50"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Recording
            </Button>

            <Button 
              onClick={isStreaming ? stopStreaming : startStreaming} 
              disabled={!isWebcamOn && !isScreenSharing}
              className={`${isStreaming ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white disabled:opacity-50`}
            >
              <Wifi className="mr-2 h-4 w-4" />
              {isStreaming ? 'Stop Streaming' : 'Start Streaming'}
            </Button>

          </div>
          
          <div className="relative bg-gray-900 rounded-lg overflow-hidden shadow-lg">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-auto" />
          </div>
        </div>
        
        <div className="bg-indigo-50 p-8">
          <h2 className="text-2xl font-semibold mb-4 text-indigo-800">How to use:</h2>
          <ol className="list-decimal list-inside space-y-2 text-indigo-900">
            <li>Click "Start Webcam" to turn on your camera.</li>
            <li>Use "Capture Screenshot" to take a picture.</li>
            <li>Click "Start Recording" to begin video capture.</li>
            <li>Click "Stop Recording" when you're done.</li>
            <li>Use "Download Recording" to save your video.</li>
            <li>Click "Start Streaming" to begin live streaming.</li>
            <li>Click "Stop Streaming" to end the live stream.</li>
            <li>Click "Start Screen Share" to share your screen.</li>
            <li>Click "Stop Screen Share" to end screen sharing.</li>
            <li>Click "Stop Webcam" to turn off the camera when finished.</li>
          </ol>
        </div>
      </div>
      }
    </div>
  );
};

export default WebcamStudio;