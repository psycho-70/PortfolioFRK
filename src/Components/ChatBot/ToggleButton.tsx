'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SmartToy, Close } from '@mui/icons-material';
import Chatbot from './ChatBot'; 
const ChatbotToggle: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg z-40"
      >
        {isOpen ? <Close /> : <SmartToy />}
      </motion.button>

      {isOpen && <Chatbot onClose={() => setIsOpen(false)} />}
    </>
  );
};

export default ChatbotToggle;
