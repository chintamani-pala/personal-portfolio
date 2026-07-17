"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FaServer, FaBrain, FaDatabase, FaMobileAlt, FaArrowRight } from "react-icons/fa";

function Architecture() {
  const [hoveredNode, setHoveredNode] = useState(null);

  const nodes = [
    {
      id: "client",
      title: "Frontend / Extension",
      icon: <FaMobileAlt size={22} className="text-[#16f2b3]" />,
      desc: "React.js, Next.js, and Chrome Extension APIs rendering fluid interfaces and handling user prompts.",
      color: "border-[#16f2b3] shadow-[#16f2b3]/20"
    },
    {
      id: "api",
      title: "FastAPI / Next.js Server",
      icon: <FaServer size={22} className="text-pink-500" />,
      desc: "Backend API routing, token validation via Clerk, LangChain orchestration, and secure payments.",
      color: "border-pink-500 shadow-pink-500/20"
    },
    {
      id: "llm",
      title: "AI Layer (Gemini / LiteLLM)",
      icon: <FaBrain size={22} className="text-violet-500" />,
      desc: "NVIDIA NIM endpoints, Google ADK agents, and model gateways performing intent parsing and RAG.",
      color: "border-violet-500 shadow-violet-500/20"
    },
    {
      id: "db",
      title: "Database / Vector Store",
      icon: <FaDatabase size={22} className="text-amber-500" />,
      desc: "Supabase PGVector storing contextual embeddings, ConvexDB for real-time states, and Socket.io events.",
      color: "border-amber-500 shadow-amber-500/20"
    }
  ];

  return (
    <div id="architecture" className="relative z-50 border-t my-12 lg:my-24 border-[#25213b]">
      <Image
        src="/section.svg"
        alt="Hero"
        width={1572}
        height={795}
        className="absolute top-0 -z-10"
      />
      <div className="flex justify-center -translate-y-[1px]">
        <div className="w-3/4">
          <div className="h-[1px] bg-gradient-to-r from-transparent via-violet-500 to-transparent w-full" />
        </div>
      </div>

      <div className="flex justify-center my-5 lg:py-8">
        <div className="flex items-center">
          <span className="w-24 h-[2px] bg-[#1a1443]"></span>
          <span className="bg-[#1a1443] w-fit text-white p-2 px-5 text-xl rounded-md">
            System Architecture
          </span>
          <span className="w-24 h-[2px] bg-[#1a1443]"></span>
        </div>
      </div>

      <p className="text-center text-gray-400 text-sm max-w-xl mx-auto mb-10 px-4">
        Interactive system workflow designed by Chintamani for full-stack RAG and AI-orchestrated tools. Hover over any block to inspect details.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-6xl mx-auto px-4 items-center relative">
        {nodes.map((node, index) => (
          <React.Fragment key={node.id}>
            <div
              className={`p-6 bg-[#0d1224] border rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-2 cursor-default ${node.color} ${
                hoveredNode === node.id ? "scale-105 border-opacity-100" : "border-opacity-50"
              }`}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <div className="flex items-center gap-3 mb-3">
                {node.icon}
                <h3 className="font-bold text-white text-base">{node.title}</h3>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed">{node.desc}</p>
            </div>
            {index < nodes.length - 1 && (
              <div className="hidden lg:flex justify-center text-violet-500">
                <FaArrowRight size={20} className="animate-pulse" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {hoveredNode && (
        <div className="mt-8 p-4 bg-[#10142e] border border-violet-800 rounded-lg max-w-lg mx-auto text-center animate-fade-in">
          <span className="text-[#16f2b3] font-bold text-sm">
            {hoveredNode === "client" && "🎯 Frontend: Serves Chrome extensions popups, captures YouTube transcripts, and handles editor buffers."}
            {hoveredNode === "api" && "⚙️ Middleware API: Invokes Python FastAPI endpoints, builds RAG prompts, and checks reCAPTCHA / Clerk security."}
            {hoveredNode === "llm" && "🧠 LLM Gateway: Executes structured planning schemas, processes agent loop prompts, and streams output via SSE."}
            {hoveredNode === "db" && "💾 Data Engine: Realtime document sync, vector indexing via Supabase / pgvector, and transactional operations."}
          </span>
        </div>
      )}
    </div>
  );
}

export default Architecture;
