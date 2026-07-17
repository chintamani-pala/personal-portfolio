"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const AgentModeContext = createContext();

export function AgentModeProvider({ children }) {
  const [isAgentMode, setIsAgentMode] = useState(false);
  const [messages, setMessages] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [status, setStatus] = useState("Idle");
  const [activeHighlight, setActiveHighlight] = useState(null);
  const [projectFilter, setProjectFilter] = useState("");
  const [customLayout, setCustomLayout] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [sessionId, setSessionId] = useState("");

  // Initialize a unique session ID
  useEffect(() => {
    setSessionId(`session-${Math.random().toString(36).substr(2, 9)}`);
  }, []);

  const toggleAgentMode = () => {
    setIsAgentMode((prev) => !prev);
  };

  const resetAgentState = () => {
    setMessages([]);
    setTimeline([]);
    setStatus("Idle");
    setActiveHighlight(null);
    setProjectFilter("");
    setCustomLayout(null);
    setIsGenerating(false);
  };

  const executeFrontEndAction = (name, args) => {
    const logId = `log-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    
    // 1. Add to visual execution timeline
    let actionDesc = "";
    if (name === "navigate") actionDesc = `Navigating to section: ${args.target}`;
    else if (name === "scroll") actionDesc = `Scrolling workspace to element: ${args.target}`;
    else if (name === "highlight") actionDesc = `Highlighting component: ${args.target}`;
    else if (name === "filterProjects") actionDesc = `Filtering projects list by: ${args.technology}`;
    else if (name === "openSection") actionDesc = `Opening section: ${args.section}`;
    else if (name === "openGithub") actionDesc = `Opening GitHub repo: ${args.repo}`;
    else if (name === "openResume") actionDesc = `Opening resume document`;
    else if (name === "renderLayout") actionDesc = `Recomposing portfolio workspace layout`;

    setTimeline((prev) => [...prev, { id: logId, text: actionDesc, status: "pending" }]);
    setStatus(actionDesc);

    // 2. Perform DOM/UI updates
    try {
      if (name === "navigate" || name === "scroll" || name === "openSection") {
        const targetId = args.target || args.section;
        if (targetId) {
          // Normalize selector/id
          const cleanId = targetId.startsWith("#") ? targetId.slice(1) : targetId;
          
          // Scroll Right Panel container or window
          setTimeout(() => {
            const element = document.getElementById(cleanId);
            const container = document.getElementById("portfolio-workspace-scroll-container");
            
            if (element) {
              if (container) {
                // If in Agent Mode, scroll the Right Panel container specifically
                const containerTop = container.getBoundingClientRect().top;
                const elementTop = element.getBoundingClientRect().top;
                container.scrollBy({
                  top: elementTop - containerTop - 20,
                  behavior: "smooth"
                });
              } else {
                element.scrollIntoView({ behavior: "smooth" });
              }
            }
          }, 300);
        }
      }

      if (name === "highlight") {
        setActiveHighlight(args.target);
        // Autoclear highlight after 6 seconds
        setTimeout(() => {
          setActiveHighlight((curr) => (curr === args.target ? null : curr));
        }, 6000);
      }

      if (name === "filterProjects") {
        setProjectFilter(args.technology || "");
      }

      if (name === "renderLayout") {
        let layoutVal = args.layout;
        if (typeof layoutVal === "string") {
          try {
            const normalized = layoutVal.trim().replace(/'/g, '"');
            const parsed = JSON.parse(normalized);
            if (Array.isArray(parsed)) {
              layoutVal = parsed;
            } else {
              layoutVal = [layoutVal];
            }
          } catch (e) {
            layoutVal = layoutVal.split(",").map(s => s.trim().replace(/['"\[\]]/g, ""));
          }
        }
        setCustomLayout(layoutVal || null);
      }

      if (name === "openGithub") {
        window.open(args.repo.startsWith("http") ? args.repo : `https://github.com/${args.repo}`, "_blank");
      }

      if (name === "openResume") {
        window.open("https://drive.google.com/file/d/1W0xSO9hKY9C2RjLJxLreBm78cIuMXP9O/view?usp=sharing", "_blank");
      }

      // Mark visual action log as successful
      setTimeline((prev) =>
        prev.map((item) => (item.id === logId ? { ...item, status: "success" } : item))
      );
    } catch (e) {
      console.error(`Error executing action ${name}:`, e);
      setTimeline((prev) =>
        prev.map((item) => (item.id === logId ? { ...item, status: "failed" } : item))
      );
    }
  };

  const sendMessage = async (text) => {
    if (!text.trim() || isGenerating) return;

    // Add user message
    const userMsg = { role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setIsGenerating(true);
    setStatus("Understanding request...");

    // Append a placeholder assistant message
    const assistantMsgId = `assistant-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      { id: assistantMsgId, role: "assistant", text: "", thoughts: "", isStreaming: true }
    ]);

    try {
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, sessionId })
      });

      if (!response.ok) {
        throw new Error("Failed to contact the portfolio AI operator.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let partialLine = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = (partialLine + chunk).split("\n");
        partialLine = lines.pop();

        let currentEvent = "";
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;

          if (trimmed.startsWith("event: ")) {
            currentEvent = trimmed.slice(7);
          } else if (trimmed.startsWith("data: ")) {
            const dataStr = trimmed.slice(6);
            try {
              const data = JSON.parse(dataStr);
              if (currentEvent === "agent_event") {
                // Process structured event
                const { type, content, call, result, error } = data;

                if (type === "thought" && content) {
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === assistantMsgId
                        ? { ...msg, thoughts: (msg.thoughts || "") + "\n" + content }
                        : msg
                    )
                  );
                  setStatus(`Thinking: ${content}`);
                }

                if (type === "content" && content) {
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === assistantMsgId
                        ? { ...msg, text: msg.text + content }
                        : msg
                    )
                  );
                }

                if (type === "tool_call" && call) {
                  executeFrontEndAction(call.name, call.args);
                }

                if (type === "error" && error) {
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === assistantMsgId
                        ? { ...msg, text: msg.text + `\n\n[Error: ${error.message}]` }
                        : msg
                    )
                  );
                }

                if (type === "finished") {
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === assistantMsgId
                        ? { ...msg, isStreaming: false }
                        : msg
                    )
                  );
                  setStatus("Done.");
                }
              }
            } catch (e) {
              console.error("Error processing SSE chunk:", e);
            }
          }
        }
      }
    } catch (err) {
      console.error("Connection error:", err);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMsgId
            ? { ...msg, text: msg.text + `\n\nFailed to get a response from the AI Operator.`, isStreaming: false }
            : msg
        )
      );
      setStatus("Error.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <AgentModeContext.Provider
      value={{
        isAgentMode,
        toggleAgentMode,
        messages,
        timeline,
        status,
        activeHighlight,
        projectFilter,
        customLayout,
        isGenerating,
        sendMessage,
        resetAgentState,
        setProjectFilter,
        setActiveHighlight
      }}
    >
      {children}
    </AgentModeContext.Provider>
  );
}

export function useAgentMode() {
  const context = useContext(AgentModeContext);
  if (!context) {
    throw new Error("useAgentMode must be used within an AgentModeProvider");
  }
  return context;
}
