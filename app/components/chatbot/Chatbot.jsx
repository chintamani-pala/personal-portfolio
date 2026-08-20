"use client";

import { useState, useRef, useEffect } from "react";
import { sendMessage } from "./chatApi";
import { personalData } from "@/utils/data/personal-data";
import { FaTimes, FaRobot, FaUser, FaSpinner } from "react-icons/fa";
import { SUGGESTED_QUESTIONS } from "./data"


function ChatMessage({ message }) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex gap-3 mb-4 ${isUser ? "flex-row-reverse" : "flex-row"
        }`}
    >
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm ${isUser
          ? "bg-gradient-to-r from-pink-500 to-violet-600 text-white"
          : "bg-[#16f2b3] text-[#0d1224]"
          }`}
      >
        {isUser ? <FaUser size={14} /> : <FaRobot size={14} />}
      </div>
      <div
        className={`max-w-[75%] px-4 py-2 rounded-lg text-sm leading-relaxed ${isUser
          ? "bg-gradient-to-r from-pink-500 to-violet-600 text-white rounded-tr-none"
          : "bg-[#11152c] text-gray-200 rounded-tl-none border border-[#353951]"
          }`}
      >
        {message.content}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3 mb-4">
      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm bg-[#16f2b3] text-[#0d1224]">
        <FaRobot size={14} />
      </div>
      <div className="bg-[#11152c] border border-[#353951] px-4 py-3 rounded-lg rounded-tl-none flex items-center gap-1">
        <FaSpinner className="animate-spin text-[#16f2b3]" size={12} />
        <span className="text-gray-400 text-sm ml-1">Thinking</span>
      </div>
    </div>
  );
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatbotRef = useRef(null);

  useEffect(() => {
    try {
      const hasVisited = localStorage.getItem("chatbot-visited");
      if (!hasVisited) {
        setShowWelcome(true);
      }
    } catch (e) {
      setShowWelcome(true);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatbotRef.current && !chatbotRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  const handleToggleChat = () => {
    try {
      if (!isOpen && showWelcome) {
        localStorage.setItem("chatbot-visited", "true");
        setShowWelcome(false);
      }
    } catch (e) {
      setShowWelcome(false);
    }
    setIsOpen((prev) => !prev);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = async (text) => {
    const query = text.trim();
    if (!query || isLoading) return;

    setInput("");
    setError(null);
    setMessages((prev) => [...prev, { role: "user", content: query }]);
    setIsLoading(true);

    try {
      const response = await sendMessage(query);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response },
      ]);
    } catch (err) {
      setError(
        "Sorry, I couldn't connect to the AI assistant. Please try again."
      );
      if (process.env.NODE_ENV === "development") {
        console.error("Chat API error:", err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSend(input);
  };

  const handleSuggestionClick = (question) => {
    handleSend(question);
  };

  const handleClose = () => {
    setIsOpen(false);
    setError(null);
  };

  const askedQuestions = new Set(
    messages
      .filter((m) => m.role === "user")
      .map((m) => m.content.trim())
  );

  const availableSuggestions = (() => {
    const unasked = SUGGESTED_QUESTIONS.filter(
      (q) => !askedQuestions.has(q)
    );

    const shuffled = [...unasked].sort(() => Math.random() - 0.5);

    return shuffled.slice(0, 5);
  })();

  return (
    <div ref={chatbotRef} className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-[90vw] sm:w-[380px] h-[500px] max-h-[80vh] bg-[#0d1224] border border-[#353951] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#353951] bg-gradient-to-r from-pink-500/10 to-violet-600/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#16f2b3] flex items-center justify-center">
                <FaRobot className="text-[#0d1224]" size={14} />
              </div>
              <div>
                <h3 className="text-white text-sm font-semibold">
                  AI Assistant
                </h3>
                <p className="text-gray-400 text-xs">
                  Ask about {personalData.name.split(" ")[0]}&apos;s portfolio
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white transition-colors duration-200 p-1"
              aria-label="Close chat"
            >
              <FaTimes size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 scroll-smooth">
            {messages.length === 0 && !isLoading && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-violet-600 flex items-center justify-center mb-4">
                  <FaRobot className="text-white" size={24} />
                </div>
                <h4 className="text-white text-lg font-medium mb-2">
                  Hi! I&apos;m {personalData.name.split(" ")[0]}&apos;s AI
                  Assistant
                </h4>
                <p className="text-gray-400 text-sm mb-6">
                  Ask me anything about his skills, projects, or experience.
                </p>
                {availableSuggestions.length > 0 && (
                  <div className="flex flex-col gap-2 w-full">
                    {availableSuggestions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(question)}
                        className="text-left px-3 py-2 rounded-lg bg-[#11152c] border border-[#353951] text-gray-300 text-xs hover:border-[#16f2b3] hover:text-[#16f2b3] transition-all duration-200"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {messages.map((message, index) => (
              <ChatMessage key={index} message={message} />
            ))}

            {isLoading && <TypingIndicator />}

            {error && (
              <div className="text-center text-red-400 text-xs mt-4 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <div ref={messagesEndRef} />

            {availableSuggestions.length > 0 && (
              <div className="mt-4">
                <p className="text-gray-500 text-xs mb-2">Suggested questions</p>
                <div className="flex flex-col gap-2">
                  {availableSuggestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(question)}
                      className="text-left px-3 py-2 rounded-lg bg-[#11152c] border border-[#353951] text-gray-300 text-xs hover:border-[#16f2b3] hover:text-[#16f2b3] transition-all duration-200"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-3 border-t border-[#353951] bg-[#0d1224]"
          >
            <div className="flex items-center gap-2 bg-[#11152c] border border-[#353951] rounded-full px-3 py-1">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask something..."
                className="flex-1 bg-transparent text-white text-sm outline-none placeholder-gray-500 py-2"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-violet-600 flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
                aria-label="Send message"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-3 h-3 rotate-90"
                >
                  <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 60.517 0 003.478 2.405z" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}

      {showWelcome && !isOpen && (
        <div className="mb-3 relative">
          <div className="bg-gradient-to-r from-pink-500 to-violet-600 text-white text-sm px-4 py-2 rounded-lg shadow-lg whitespace-nowrap">
            How can I help you?
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-gradient-to-r from-pink-500 to-violet-600 rotate-45"></div>
        </div>
      )}

      <button
        onClick={handleToggleChat}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-pink-500 to-violet-600 flex items-center justify-center text-white shadow-lg hover:scale-110 transition-all duration-300"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? <FaTimes size={20} /> : <FaRobot size={24} />}
      </button>
    </div>
  );
}
