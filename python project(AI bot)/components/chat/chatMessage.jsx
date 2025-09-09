import React from "react";
import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";

export default function MessageBubble({ message, isTyping = false }) {
  const isUser = message.role === "user";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-4 mb-6 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && (
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <Bot className="w-5 h-5 text-white" />
          </div>
        </div>
      )}
      
      <div className={`max-w-[70%] ${isUser ? "order-first" : ""}`}>
        <div className={`relative px-4 py-3 rounded-2xl shadow-sm ${
          isUser 
            ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white ml-auto" 
            : "bg-white border border-slate-200"
        }`}>
          {isTyping ? (
            <div className="flex items-center space-x-1 py-2">
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          ) : (
            <div className={`prose prose-sm max-w-none ${isUser ? "text-white" : "text-slate-700"}`}>
              {isUser ? (
                <p className="mb-0 whitespace-pre-wrap">{message.content}</p>
              ) : (
                <ReactMarkdown className="mb-0">{message.content}</ReactMarkdown>
              )}
            </div>
          )}
        </div>
        
        {!isTyping && (
          <div className={`flex items-center gap-2 mt-1 text-xs text-slate-500 ${
            isUser ? "justify-end" : "justify-start"
          }`}>
            <span>{format(new Date(message.created_date || Date.now()), "HH:mm")}</span>
            {message.tokens_used && (
              <span className="text-slate-400">• {message.tokens_used} tokens</span>
            )}
          </div>
        )}
      </div>
      
      {isUser && (
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-gradient-to-br from-slate-300 to-slate-400 rounded-full flex items-center justify-center shadow-lg">
            <User className="w-5 h-5 text-slate-600" />
          </div>
        </div>
      )}
    </motion.div>
  );
}