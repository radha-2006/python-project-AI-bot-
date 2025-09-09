import React, { useState, useEffect } from "react";
import { ChatMessage } from "@/entities/ChatMessage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, Bot, User, Calendar, Hash } from "lucide-react";
import { format, isToday, isYesterday } from "date-fns";
import { motion } from "framer-motion";

export default function History() {
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setIsLoading(true);
    try {
      const allMessages = await ChatMessage.list("-created_date", 200);
      setMessages(allMessages);

      // Group messages by conversation
      const grouped = {};
      allMessages.forEach(message => {
        const convId = message.conversation_id || 'default';
        if (!grouped[convId]) {
          grouped[convId] = [];
        }
        grouped[convId].push(message);
      });

      setConversations(grouped);
    } catch (error) {
      console.error("Error loading history:", error);
    }
    setIsLoading(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'MMM d, yyyy');
  };

  const getConversationPreview = (messages) => {
    const firstUserMessage = messages.find(m => m.role === 'user');
    return firstUserMessage ? firstUserMessage.content.slice(0, 60) + '...' : 'New conversation';
  };

  const getConversationStats = (messages) => {
    const userCount = messages.filter(m => m.role === 'user').length;
    const aiCount = messages.filter(m => m.role === 'assistant').length;
    const totalTokens = messages.reduce((sum, m) => sum + (m.tokens_used || 0), 0);
    return { userCount, aiCount, totalTokens };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-auto bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Chat History</h1>
          <p className="text-slate-600">Review your previous conversations with the AI assistant</p>
        </div>

        {Object.keys(conversations).length === 0 ? (
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6 text-center">
              <MessageCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-700 mb-2">No conversations yet</h3>
              <p className="text-slate-500">Start chatting to see your conversation history here!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Conversations List */}
            <div className="lg:col-span-1 space-y-4">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">Conversations</h2>
              {Object.entries(conversations).map(([convId, convMessages]) => {
                const stats = getConversationStats(convMessages);
                const latestMessage = convMessages[0];
                
                return (
                  <motion.div
                    key={convId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card 
                      className={`cursor-pointer hover:shadow-lg transition-all duration-200 ${
                        selectedConversation === convId ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-slate-50'
                      }`}
                      onClick={() => setSelectedConversation(convId)}
                    >
                      <CardHeader className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <MessageCircle className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-slate-800 truncate">
                              {getConversationPreview(convMessages)}
                            </h3>
                            <p className="text-xs text-slate-500 mt-1">
                              {formatDate(latestMessage.created_date)}
                            </p>
                            <div className="flex gap-2 mt-2">
                              <Badge variant="outline" className="text-xs">
                                {stats.userCount + stats.aiCount} messages
                              </Badge>
                              {stats.totalTokens > 0 && (
                                <Badge variant="outline" className="text-xs">
                                  {stats.totalTokens} tokens
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* Conversation Details */}
            <div className="lg:col-span-2">
              {selectedConversation ? (
                <Card className="h-full">
                  <CardHeader className="border-b">
                    <CardTitle className="flex items-center gap-2">
                      <Hash className="w-5 h-5" />
                      Conversation Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 max-h-96 overflow-y-auto">
                    <div className="space-y-4">
                      {conversations[selectedConversation].reverse().map((message) => (
                        <div key={message.id} className="flex gap-4">
                          <div className="flex-shrink-0">
                            {message.role === 'user' ? (
                              <div className="w-8 h-8 bg-gradient-to-br from-slate-300 to-slate-400 rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 text-slate-600" />
                              </div>
                            ) : (
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                <Bot className="w-4 h-4 text-white" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm capitalize">
                                {message.role === 'user' ? 'You' : 'AI Assistant'}
                              </span>
                              <span className="text-xs text-slate-500">
                                {format(new Date(message.created_date), "HH:mm")}
                              </span>
                            </div>
                            <div className="text-sm text-slate-700 whitespace-pre-wrap">
                              {message.content}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="h-full flex items-center justify-center">
                  <CardContent className="text-center">
                    <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-700 mb-2">Select a conversation</h3>
                    <p className="text-slate-500">Choose a conversation from the left to view its details</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}