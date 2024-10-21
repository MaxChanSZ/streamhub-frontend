import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from "@/components/shadcn/ui/button";
import { Camera, Video, Square, Download, Wifi } from 'lucide-react';
import { io, Socket } from 'socket.io-client';

const WebcamStudio: React.FC = () => {
  const [isWebcamOn, setIsWebcamOn] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const peerConnectionsRef = useRef<{ [id: string]: RTCPeerConnection }>({});
  const socketRef = useRef<Socket | null>(null);

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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Webcam Studio</h1>
      
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>}
      
      <div className="mb-4 flex items-center space-x-4">
        <Button onClick={isWebcamOn ? stopWebcam : startWebcam}>
          <Camera className="mr-2 h-4 w-4" />
          {isWebcamOn ? 'Stop Webcam' : 'Start Webcam'}
        </Button>
        
        <Button onClick={captureScreenshot} disabled={!isWebcamOn}>
          <Camera className="mr-2 h-4 w-4" />
          Capture Screenshot
        </Button>
        
        <Button onClick={isRecording ? stopRecording : startRecording} disabled={!isWebcamOn}>
          {isRecording ? <Square className="mr-2 h-4 w-4" /> : <Video className="mr-2 h-4 w-4" />}
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </Button>
        
        <Button onClick={downloadRecording} disabled={recordedChunks.length === 0}>
          <Download className="mr-2 h-4 w-4" />
          Download Recording
        </Button>

        <Button onClick={isStreaming ? stopStreaming : startStreaming} disabled={!isWebcamOn}>
          <Wifi className="mr-2 h-4 w-4" />
          {isStreaming ? 'Stop Streaming' : 'Start Streaming'}
        </Button>
      </div>
      
      <div className="relative">
        <video ref={videoRef} autoPlay playsInline muted className="w-full h-auto" />
      </div>
      
      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">How to use:</h2>
        <ol className="list-decimal list-inside">
          <li>Click "Start Webcam" to turn on your camera.</li>
          <li>Use "Capture Screenshot" to take a picture.</li>
          <li>Click "Start Recording" to begin video capture.</li>
          <li>Click "Stop Recording" when you're done.</li>
          <li>Use "Download Recording" to save your video.</li>
          <li>Click "Start Streaming" to begin live streaming.</li>
          <li>Click "Stop Streaming" to end the live stream.</li>
          <li>Click "Stop Webcam" to turn off the camera when finished.</li>
        </ol>
      </div>
    </div>
  );
};

export default WebcamStudio;
