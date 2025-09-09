import React, { useState, useEffect, useRef } from "react";
import { ChatMessage } from "@/entities/ChatMessage";
import { InvokeLLM } from "@/integrations/Core";
import { motion, AnimatePresence } from "framer-motion";
import MessageBubble from "../components/chat/MessageBubble";
import ChatInput from "../components/chat/ChatInput";
import WelcomeScreen from "../components/chat/WelcomeScreen";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId] = useState(() => `conv_${Date.now()}`);
  const messagesEndRef = useRef(null);
  const [showTyping, setShowTyping] = useState(false);

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, showTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadMessages = async () => {
    try {
      const chatHistory = await ChatMessage.list("-created_date", 50);
      setMessages(chatHistory.reverse());
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const sendMessage = async (content) => {
    setIsLoading(true);
    setShowTyping(true);

    try {
      // Save user message
      const userMessage = await ChatMessage.create({
        content,
        role: "user",
        conversation_id: conversationId
      });

      setMessages(prev => [...prev, userMessage]);

      // Get conversation context (last 10 messages)
      const recentMessages = messages.slice(-10);
      const conversationContext = recentMessages.map(msg => 
        `${msg.role}: ${msg.content}`
      ).join('\n');

      // Generate AI response
      const prompt = `You are a helpful AI assistant. Continue this conversation naturally and helpfully.

Previous conversation:
${conversationContext}

User: ${content}

Please provide a helpful, informative, and engaging response. Be natural and conversational.`;

      const aiResponse = await InvokeLLM({
        prompt,
        add_context_from_internet: false
      });

      setShowTyping(false);

      // Save AI message
      const aiMessage = await ChatMessage.create({
        content: aiResponse,
        role: "assistant",
        conversation_id: conversationId,
        tokens_used: Math.floor(aiResponse.length / 4) // Rough token estimate
      });

      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error("Error sending message:", error);
      setShowTyping(false);
      
      // Add error message
      const errorMessage = {
        id: `error_${Date.now()}`,
        content: "Sorry, I'm having trouble responding right now. Please try again.",
        role: "assistant",
        created_date: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="flex-1 overflow-auto">
        {messages.length === 0 && !showTyping ? (
          <WelcomeScreen />
        ) : (
          <div className="max-w-4xl mx-auto px-6 py-8">
            <AnimatePresence>
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              
              {showTyping && (
                <MessageBubble 
                  key="typing"
                  message={{ role: "assistant", content: "" }} 
                  isTyping={true}
                />
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
    </div>
  );
}