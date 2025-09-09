import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, MessageCircle, X } from "lucide-react";
import { format } from "date-fns";

export default function ConversationSidebar({ 
    conversations, 
    currentConversation, 
    onNewConversation, 
    onSelectConversation,
    isOpen,
    onToggle 
}) {
    return (
        <>
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-40 md:hidden"
                        onClick={onToggle}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.div
                initial={{ x: -320 }}
                animate={{ x: isOpen ? 0 : -320 }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="fixed left-0 top-0 h-full w-80 bg-white border-r border-gray-200 z-50 md:relative md:translate-x-0 md:z-auto"
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <MessageCircle className="w-5 h-5" />
                            Conversations
                        </h2>
                        <div className="flex gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onNewConversation}
                                className="text-gray-600 hover:text-gray-900"
                            >
                                <Plus className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onToggle}
                                className="md:hidden"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* New Chat Button */}
                    <div className="p-4">
                        <Button
                            onClick={onNewConversation}
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            New Conversation
                        </Button>
                    </div>

                    {/* Conversations List */}
                    <div className="flex-1 overflow-hidden">
                        <ScrollArea className="h-full px-4">
                            <div className="space-y-2 pb-4">
                                {conversations.length === 0 ? (
                                    <div className="text-center text-gray-500 py-8">
                                        <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                        <p>No conversations yet</p>
                                        <p className="text-sm">Start your first chat!</p>
                                    </div>
                                ) : (
                                    conversations.map((conversation) => (
                                        <motion.div
                                            key={conversation.id}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <Button
                                                variant="ghost"
                                                onClick={() => onSelectConversation(conversation)}
                                                className={`w-full h-auto p-3 justify-start text-left hover:bg-gray-50 ${
                                                    currentConversation?.id === conversation.id 
                                                        ? "bg-blue-50 border-blue-200 border" 
                                                        : ""
                                                }`}
                                            >
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-gray-900 truncate mb-1">
                                                        {conversation.title}
                                                    </p>
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-xs text-gray-500">
                                                            {conversation.messages?.length || 0} messages
                                                        </p>
                                                        <p className="text-xs text-gray-400">
                                                            {format(new Date(conversation.last_message_at), "MMM d")}
                                                        </p>
                                                    </div>
                                                </div>
                                            </Button>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        </ScrollArea>
                    </div>
                </div>
            </motion.div>
        </>
    );
}