'use client';

import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { 
  Box, 
  IconButton, 
  TextField, 
  Typography,
  CircularProgress
} from '@mui/material';
import { Send, Close, SmartToy } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

// Types
interface Message {
  text: string;
  sender: 'user' | 'ai';
  id: number;
}

interface ChatbotProps {
  onClose: any;
  darkMode?: boolean;
}

const Chatbot: React.FC<ChatbotProps> = ({ onClose, darkMode }) => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      text: "Hello! I'm your AI portfolio assistant. Ask me about my skills, projects, or experience!", 
      sender: 'ai',
      id: Date.now()
    }
  ]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Gemini - IMPORTANT: In production, call a backend service instead
  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (): Promise<void> => {
    if (input.trim() === '' || isLoading) return;
    
    // Add user message
    const userMessage: Message = { 
      text: input, 
      sender: 'user',
      id: Date.now() + 1
    };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);
    
    try {
      // Get the generative model
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      // Create a prompt that includes portfolio context
      const prompt = `
        You are an AI assistant for a professional portfolio website. 
        The user is a potential employer or client. 
        Answer questions professionally and keep responses concise.
        The portfolio includes skills, projects, work experience, and services.
        
        Current conversation:
        ${messages.slice(-5).map(m => `${m.sender}: ${m.text}`).join('\n')}
        
        User question: ${currentInput}
      `;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Add AI message
      const aiMessage: Message = { 
        text: text.replace(/\*\*/g, ''), // Remove markdown bold
        sender: 'ai',
        id: Date.now() + 2
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error calling Gemini:", error);
      const errorMessage: Message = { 
        text: "Sorry, I'm having trouble responding. Please try again later.", 
        sender: 'ai',
        id: Date.now() + 3
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInput(e.target.value);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 20 }}
      transition={{ type: 'spring', damping: 20 }}
      className={`fixed bottom-6 right-6 w-96 h-[500px] rounded-xl shadow-xl flex flex-col z-50 overflow-hidden ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}
    >
      {/* Header */}
      <div className={`p-4 flex justify-between items-center ${
        darkMode ? 'bg-purple-700' : 'bg-blue-600'
      } text-white`}>
        <div className="flex items-center gap-2">
          <SmartToy className="text-white" />
          <Typography variant="h6" className="font-medium">
            Portfolio Assistant
          </Typography>
        </div>
        <IconButton 
          onClick={onClose} 
          className="text-white"
          aria-label="Close chatbot"
        >
          <Close />
        </IconButton>
      </div>
      
      {/* Messages */}
      <Box className={`flex-1 p-4 overflow-y-auto ${
        darkMode ? 'bg-gray-700' : 'bg-gray-50'
      }`}>
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-xs md:max-w-md rounded-lg p-3 ${
                  message.sender === 'user' 
                    ? darkMode 
                      ? 'bg-purple-600 text-white rounded-br-none' 
                      : 'bg-blue-600 text-white rounded-br-none'
                    : darkMode
                      ? 'bg-gray-600 text-white rounded-bl-none'
                      : 'bg-gray-200 text-gray-800 rounded-bl-none'
                }`}
              >
                {message.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className={`rounded-lg rounded-bl-none p-3 ${
              darkMode ? 'bg-gray-600 text-white' : 'bg-gray-200 text-gray-800'
            }`}>
              <CircularProgress size={16} className="mr-2" />
              Thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </Box>
      
      {/* Input */}
      <div className={`p-3 border-t ${
        darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-white'
      }`}>
        <div className="flex gap-2">
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder="Ask about my projects..."
            value={input}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            className="flex-1"
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                    borderColor: darkMode ? '#4B5563' : '#E5E7EB',
                },
                '&:hover fieldset': {
                    borderColor: darkMode ? '#6B7280' : '#D1D5DB',
                },
                backgroundColor: darkMode ? '#374151' : 'white',
                color: darkMode ? 'white' : 'inherit',
              },
              '& .MuiInputLabel-root': {
                color: darkMode ? '#9CA3AF' : '#6B7280',
              },
              '& .MuiOutlinedInput-input': {
                color: darkMode ? 'white' : 'inherit',
              },
            }}
          />
          <IconButton 
            color="primary" 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            aria-label="Send message"
            sx={{
              backgroundColor: darkMode ? '#7C3AED' : '#2563EB',
              color: 'white',
              '&:hover': {
                backgroundColor: darkMode ? '#6D28D9' : '#1D4ED8',
              },
              '&:disabled': {
                backgroundColor: darkMode ? '#4B5563' : '#E5E7EB',
              }
            }}
          >
            <Send />
          </IconButton>
        </div>
      </div>
    </motion.div>
  );
};

export default Chatbot;