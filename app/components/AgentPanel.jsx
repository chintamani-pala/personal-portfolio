"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAgentMode } from "@/context/AgentModeContext";
import { FaPaperPlane, FaUndo, FaTerminal, FaRobot, FaUser, FaCheckCircle, FaSpinner, FaTimesCircle } from "react-icons/fa";

function AgentPanel() {
  const {
    messages,
    timeline,
    status,
    isGenerating,
    sendMessage,
    resetAgentState
  } = useAgentMode();

  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  // Automatically scroll chat to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isGenerating]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isGenerating) return;
    sendMessage(input);
    setInput("");
  };

  const getTimelineStatusIcon = (status) => {
    if (status === "pending") {
      return <FaSpinner className="text-amber-500 animate-spin" size={14} />;
    } else if (status === "success") {
      return <FaCheckCircle className="text-[#16f2b3]" size={14} />;
    } else {
      return <FaTimesCircle className="text-red-500" size={14} />;
    }
  };

  return (
    <div className="w-full h-full bg-[#0d1224] border-r border-[#1b2c68a0] flex flex-col justify-between text-white font-sans">
      
      {/* 1. Header Area */}
      <div className="px-6 py-4 border-b border-[#1b2c68a0] flex items-center justify-between bg-[#0a0d37]/40">
        <div>
          <h2 className="text-base font-bold text-[#16f2b3] flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16f2b3] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#16f2b3]"></span>
            </span>
            AI OPERATOR CONSOLE
          </h2>
          <p className="text-[10px] text-gray-400">Model: meta/llama-3.1-8b-instruct</p>
        </div>
        <button
          onClick={resetAgentState}
          title="Reset Console"
          className="p-2 rounded-full border border-violet-800 bg-[#0d1224] hover:bg-violet-950 text-gray-300 hover:text-white transition-all"
        >
          <FaUndo size={14} />
        </button>
      </div>

      {/* 2. Main Chat / Timeline Area */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 scrollbar-thin">
        
        {/* Chat History */}
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="p-4 rounded-lg bg-[#10142e] border border-violet-950 text-center space-y-2 mt-4">
              <FaRobot className="mx-auto text-violet-500" size={32} />
              <p className="text-sm font-semibold">Welcome to Agent Mode!</p>
              <p className="text-xs text-gray-400">
                I can operate this portfolio in real time. Try asking me:
              </p>
              <div className="flex flex-col gap-1.5 pt-2">
                <button
                  onClick={() => sendMessage("Show me your AI projects")}
                  className="text-xs text-[#16f2b3] hover:underline bg-[#0d1224] py-1 border border-indigo-900 rounded"
                >
                  &quot;Show me your AI projects&quot;
                </button>
                <button
                  onClick={() => sendMessage("Navigate to my skills section and highlight FastAPI")}
                  className="text-xs text-[#16f2b3] hover:underline bg-[#0d1224] py-1 border border-indigo-900 rounded"
                >
                  &quot;Scroll to skills and highlight FastAPI&quot;
                </button>
                <button
                  onClick={() => sendMessage("Compare youtube-chat-plugin and Codemate projects")}
                  className="text-xs text-[#16f2b3] hover:underline bg-[#0d1224] py-1 border border-indigo-900 rounded"
                >
                  &quot;Compare YouTube Chat Plugin &amp; Codemate&quot;
                </button>
              </div>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div key={index} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                
                {/* Thoughts/Reasoning Accordion for Assistant */}
                {msg.role === "assistant" && msg.thoughts && (
                  <div className="w-[90%] mb-2 text-xs text-gray-400 bg-black/30 p-2.5 rounded-lg border border-violet-950/60 font-mono">
                    <div className="flex items-center gap-1.5 text-[10px] text-violet-400 font-bold uppercase mb-1">
                      <FaTerminal size={10} /> Thought Log
                    </div>
                    <div className="whitespace-pre-wrap leading-relaxed">
                      {msg.thoughts}
                    </div>
                  </div>
                )}

                {/* Message Bubble */}
                <div className={`max-w-[90%] p-3.5 rounded-xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-[#604ce0] text-white rounded-br-none"
                    : "bg-[#10142e] border border-violet-900/60 text-white rounded-bl-none"
                }`}>
                  <div className="flex items-center gap-1.5 mb-1.5 opacity-60 text-[10px] uppercase font-bold">
                    {msg.role === "user" ? <FaUser size={10} /> : <FaRobot size={12} />}
                    {msg.role === "user" ? "You" : "Operator"}
                  </div>
                  <div className="whitespace-pre-wrap">{msg.text || (msg.isStreaming && "...")}</div>
                </div>
              </div>
            ))
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Execution Timeline */}
        {timeline.length > 0 && (
          <div className="pt-4 border-t border-[#1b2c68a0]">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
              <FaTerminal size={12} /> Execution Timeline
            </h3>
            <div className="space-y-2.5">
              {timeline.map((item) => (
                <div key={item.id} className="flex items-start gap-2 text-xs font-mono bg-black/15 p-2 rounded border border-indigo-900/30">
                  <div className="pt-0.5">{getTimelineStatusIcon(item.status)}</div>
                  <div className="flex-1 text-gray-300 leading-snug">{item.text}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. Status & Input Area */}
      <div className="p-4 border-t border-[#1b2c68a0] bg-[#0a0d37]/30 space-y-3">
        {/* Status Widget */}
        <div className="flex items-center justify-between text-xs px-2">
          <span className="text-gray-400">Current Task:</span>
          <span className="text-[#16f2b3] font-semibold truncate max-w-[200px]" title={status}>
            {status}
          </span>
        </div>

        {/* Form Input */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2 bg-[#0d1224] border border-[#1b2c68a0] rounded-full px-4 py-1.5 focus-within:border-violet-600 transition-all">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isGenerating}
            placeholder={isGenerating ? "AI is processing..." : "Ask me to navigate, scroll, highlight..."}
            className="flex-1 bg-transparent text-sm text-white border-none outline-none placeholder-gray-500 py-1"
          />
          <button
            type="submit"
            disabled={isGenerating || !input.trim()}
            className="p-2 rounded-full bg-gradient-to-r from-pink-500 to-violet-600 text-white disabled:opacity-40 transition-all hover:scale-105 active:scale-95"
          >
            <FaPaperPlane size={12} />
          </button>
        </form>
      </div>

    </div>
  );
}

export default AgentPanel;
