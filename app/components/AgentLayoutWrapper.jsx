"use client";

import React from "react";
import { AgentModeProvider, useAgentMode } from "@/context/AgentModeContext";
import AgentPanel from "./AgentPanel";
import Navbar from "./navbar";
import Footer from "./footer";

function AgentLayoutContent({ children }) {
  const { isAgentMode } = useAgentMode();

  if (isAgentMode) {
    return (
      <div className="fixed inset-0 z-[99999] bg-[#0d1224] flex overflow-hidden w-full h-screen">
        {/* Left Side: Agent Operator Panel */}
        <div className="w-[320px] sm:w-[380px] md:w-[440px] flex-shrink-0 h-full border-r border-[#1b2c68a0]">
          <AgentPanel />
        </div>
        
        {/* Right Side: Original Portfolio Workspace */}
        <div 
          id="portfolio-workspace-scroll-container" 
          className="flex-1 h-full overflow-y-auto scroll-smooth bg-[#0d1224] relative px-4 sm:px-8 md:px-12 lg:max-w-none xl:max-w-none text-white w-full"
        >
          <div className="max-w-[70rem] xl:max-w-[76rem] 2xl:max-w-[92rem] mx-auto min-h-screen flex flex-col justify-between">
            <div>
              <Navbar />
              <div className="pb-16">{children}</div>
            </div>
            <Footer />
          </div>
        </div>
      </div>
    );
  }

  // Normal mode
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

export default function AgentLayoutWrapper({ children }) {
  return (
    <AgentModeProvider>
      <AgentLayoutContent>{children}</AgentLayoutContent>
    </AgentModeProvider>
  );
}
