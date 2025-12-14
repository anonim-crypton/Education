"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle, Send } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Assalomu alaykum! Men EduGame AI yordamchisiman. Sizga qanday yordam bera olaman?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Rahmat sizning savolingiz uchun! Men hozir sizga javob berish uchun tayyorman. Boshqa savollar bo\'lsa, o\'zroq so\'rasin.',
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 800);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed right-6 bottom-6 z-40 w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
        aria-label="AI Assistant"
      >
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <MessageCircle className="w-6 h-6" />
        </motion.div>
      </motion.button>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/30 z-40 md:hidden"
            />

            {/* Chat Window */}
            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed right-0 bottom-32 w-96 max-w-[calc(100%-24px)] h-96 bg-card border-l border-border shadow-2xl z-50 flex flex-col overflow-hidden rounded-tl-2xl rounded-tr-2xl"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-4 flex items-start justify-between gap-3 flex-shrink-0">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg leading-tight">AI Yordamchi</h3>
                  <p className="text-xs text-blue-100 mt-1">Har doim tayyor</p>
                </div>
                <motion.button
                  onClick={() => setIsOpen(false)}
                  whileHover={{ rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 hover:bg-blue-700 rounded-lg transition-colors flex-shrink-0"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${
                      message.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        message.sender === "user"
                          ? "bg-blue-600 text-white rounded-br-none"
                          : "bg-secondary text-foreground rounded-bl-none"
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.sender === "user"
                            ? "text-blue-100"
                            : "text-muted-foreground"
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString("uz-UZ", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </motion.div>
                ))}

                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2"
                  >
                    <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="w-2 h-2 bg-blue-600 rounded-full"
                      />
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Input Area */}
              <div className="border-t border-border p-4 space-y-3">
                <div className="flex gap-2">
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Sizning savolingiz..."
                    rows={3}
                    className="flex-1 px-3 py-2 rounded-lg bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-blue-600 text-foreground placeholder-muted-foreground resize-none text-sm"
                  />
                </div>
                <motion.button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Yuborish
                </motion.button>
              </div>

              {/* Quick Actions */}
              <div className="border-t border-border p-3 space-y-2">
                <p className="text-xs text-muted-foreground font-medium">Tez savollar:</p>
                <div className="space-y-1">
                  {[
                    "Kurslar haqida",
                    "O'qituvchilar haqida",
                    "Qanday ro'yxatdan o'taman?",
                  ].map((question, idx) => (
                    <motion.button
                      key={idx}
                      onClick={() => {
                        setInputValue(question);
                        setTimeout(() => {
                          const userMsg: Message = {
                            id: Date.now().toString(),
                            text: question,
                            sender: "user",
                            timestamp: new Date(),
                          };
                          setMessages((prev) => [...prev, userMsg]);
                          setInputValue("");
                          setIsLoading(true);
                          setTimeout(() => {
                            const aiMsg: Message = {
                              id: (Date.now() + 1).toString(),
                              text: "Bu savolingizga javob berish uchun man tayyorman!",
                              sender: "ai",
                              timestamp: new Date(),
                            };
                            setMessages((prev) => [...prev, aiMsg]);
                            setIsLoading(false);
                          }, 800);
                        }, 100);
                      }}
                      whileHover={{ backgroundColor: "#f3f4f6" }}
                      className="w-full text-left text-xs px-2 py-1.5 rounded bg-secondary hover:bg-gray-200 dark:hover:bg-gray-700 text-foreground transition-colors"
                    >
                      {question}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
