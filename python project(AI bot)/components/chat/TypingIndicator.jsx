import React from "react";
import { motion } from "framer-motion";
import { Bot } from "lucide-react";

export default function TypingIndicator() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-4"
        >
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-r from-blue-500 to-purple-600">
                <Bot className="w-5 h-5 text-white" />
            </div>

            {/* Typing Animation */}
            <div className="bg-white shadow-md border border-gray-200 rounded-2xl rounded-bl-md p-4 max-w-xs">
                <div className="flex items-center gap-1">
                    <span className="text-gray-600 text-sm mr-2">AI is typing</span>
                    <div className="flex space-x-1">
                        {[0, 1, 2].map((index) => (
                            <motion.div
                                key={index}
                                className="w-2 h-2 bg-gray-400 rounded-full"
                                animate={{
                                    y: [0, -4, 0],
                                    opacity: [0.4, 1, 0.4]
                                }}
                                transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    delay: index * 0.2
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}