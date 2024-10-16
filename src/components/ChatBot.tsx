import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';

import steamboatWillieVideo from '../video/steamboatwillie_001.webm';

const API_KEY = import.meta.env.VITE_GOOGLE_AI_API_KEY || '';
const genAI = new GoogleGenerativeAI(API_KEY);

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

const VideoChatbot = () => {
  const [videoUri, setVideoUri] = useState('');
  const [messages, setMessages] = useState<Message[]>([]); 
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    uploadVideo();
  }, []);

  const uploadVideo = async () => {
    setIsLoading(true);
    try {
      // Fetch the video file
      const response = await fetch(steamboatWillieVideo);
      const blob = await response.blob();
      const file = new File([blob], 'steamboatwillie_001.mp4', { type: 'video/mp4' });

      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await axios.post('https://generativelanguage.googleapis.com/v1beta/files:upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${API_KEY}`,
        },
        params: {
          mimeType: 'video/mp4',
        },
      });

      setVideoUri(uploadResponse.data.uri);
      setMessages([{ text: 'Video uploaded successfully. You can now ask questions about it.', sender: 'bot' }]);
    } catch (error) {
      console.error('Error uploading video:', error);
      setMessages([{ text: 'Error uploading video. Please try again.', sender: 'bot' }]);
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !videoUri) return;

    setMessages(prevMessages => [...prevMessages, { text: input, sender: 'user' }]);
    setInput('');
    setIsLoading(true);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      const result = await model.generateContent([
        {
          fileData: {
            mimeType: 'video/mp4',
            fileUri: videoUri
          }
        },
        { text: input },
      ]);

      const response = result.response.text();
      setMessages(prevMessages => [...prevMessages, { text: response, sender: 'bot' }]);
    } catch (error) {
      console.error('Error generating response:', error);
      setMessages(prevMessages => [...prevMessages, { text: 'Sorry, I encountered an error. Please try again.', sender: 'bot' }]);
    }

    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-blue-500 text-white p-2 rounded-full shadow-lg"
        >
          Chat
        </button>
      ) : (
        <div className="bg-white rounded-lg shadow-xl w-80 h-96 flex flex-col">
          <div className="flex justify-between items-center p-2 border-b">
            <h2 className="text-lg font-semibold">Video Chatbot</h2>
            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">
              ×
            </button>
          </div>
          <div className="flex-grow overflow-y-auto p-2">
            {messages.map((message, index) => (
              <div key={index} className={`mb-2 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                <span className={`inline-block p-2 rounded-lg ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                  {message.text}
                </span>
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="p-2 border-t">
            <div className="flex">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                className="flex-grow border p-2 mr-2 rounded"
                disabled={isLoading || !videoUri}
              />
              <button type="submit" className="bg-blue-500 text-white p-2 rounded" disabled={isLoading || !videoUri}>
                {isLoading ? '...' : 'Send'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default VideoChatbot;


