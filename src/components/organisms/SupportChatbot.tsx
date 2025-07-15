'use client';

import React, { useState } from 'react';
import { Card } from '@/components/atoms/Card';
import { Button } from '@/components/atoms/Button';
import { MessageCircle, X, Send, Bot } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const faqData = [
  {
    question: "How do I earn XP?",
    answer: "You earn XP by completing lessons! Each lesson gives you XP based on your performance. Correct answers give you full XP, while incorrect answers give you partial XP."
  },
  {
    question: "What are streaks?",
    answer: "Streaks track how many consecutive days you've used FinMate. The longer your streak, the more motivated you'll be to keep learning!"
  },
  {
    question: "How do levels work?",
    answer: "Levels are calculated based on your total XP. Every 1000 XP = 1 level. Higher levels unlock more advanced content and features."
  },
  {
    question: "Can I change my financial goal?",
    answer: "Yes! You can change your financial goal at any time from your dashboard. Your progress will be saved for each goal."
  },
  {
    question: "What if I get a question wrong?",
    answer: "Don't worry! You still earn XP for trying, and you'll get an explanation of the correct answer to help you learn."
  }
];

export const SupportChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your FinMate assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse = generateBotResponse(inputValue);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const generateBotResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();
    
    if (lowerInput.includes('xp') || lowerInput.includes('experience')) {
      return "You earn XP by completing lessons! Each lesson gives you XP based on your performance. Correct answers give you full XP, while incorrect answers give you partial XP.";
    }
    
    if (lowerInput.includes('streak')) {
      return "Streaks track how many consecutive days you've used FinMate. The longer your streak, the more motivated you'll be to keep learning!";
    }
    
    if (lowerInput.includes('level')) {
      return "Levels are calculated based on your total XP. Every 1000 XP = 1 level. Higher levels unlock more advanced content and features.";
    }
    
    if (lowerInput.includes('goal') || lowerInput.includes('change')) {
      return "Yes! You can change your financial goal at any time from your dashboard. Your progress will be saved for each goal.";
    }
    
    if (lowerInput.includes('wrong') || lowerInput.includes('incorrect')) {
      return "Don't worry! You still earn XP for trying, and you'll get an explanation of the correct answer to help you learn.";
    }
    
    if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
      return "Hello! I'm here to help you with any questions about FinMate. Feel free to ask about XP, streaks, levels, or anything else!";
    }
    
    return "I'm not sure about that. Try asking about XP, streaks, levels, or how to change your financial goals!";
  };

  const handleQuickQuestion = (question: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text: question,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    setTimeout(() => {
      const botResponse = generateBotResponse(question);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 z-50"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-end p-4 z-50">
          <Card className="w-full max-w-md h-96 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5 text-orange-500" />
                <h3 className="font-semibold text-gray-900">FinMate Support</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      message.isUser
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Questions */}
            <div className="p-4 border-t">
              <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
              <div className="flex flex-wrap gap-2">
                {faqData.slice(0, 3).map((faq, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickQuestion(faq.question)}
                    className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-full transition-colors"
                  >
                    {faq.question}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your question..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  size="sm"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}; 