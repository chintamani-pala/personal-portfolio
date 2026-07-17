"use client";

import React, { useEffect } from 'react';
import { useAgentMode } from "@/context/AgentModeContext";
import AboutSection from "./components/homepage/about";
import Blog from "./components/homepage/blog";
import ContactSection from "./components/homepage/contact";
import Education from "./components/homepage/education";
import Experience from "./components/homepage/experience";
import HeroSection from "./components/homepage/hero-section";
import Projects from "./components/homepage/projects";
import Skills from "./components/homepage/skills";
import Github from "./components/homepage/github";
import Architecture from "./components/homepage/architecture";
import security from "./security";

export default function Home() {
  const { isAgentMode, customLayout, activeHighlight } = useAgentMode();

  useEffect(() => {    
    security();
  }, []);

  const components = {
    HeroSection: <HeroSection key="hero" />,
    AboutSection: <AboutSection key="about" />,
    Projects: <Projects key="projects" />,
    Skills: <Skills key="skills" />,
    Experience: <Experience key="experience" />,
    Education: <Education key="education" />,
    Blog: <Blog key="blog" />,
    Github: <Github key="github" />,
    ContactSection: <ContactSection key="contact" />,
    Architecture: <Architecture key="architecture" />
  };

  const renderComponent = (name) => {
    const cleanName = name.trim();
    const component = components[cleanName];
    if (!component) return null;

    const sectionIds = {
      HeroSection: "hero",
      AboutSection: "about",
      Projects: "projects",
      Skills: "skills",
      Experience: "experience",
      Education: "education",
      Blog: "blog",
      Github: "github",
      ContactSection: "contact",
      Architecture: "architecture"
    };

    const id = sectionIds[cleanName];
    const isHighlighted = activeHighlight === id || activeHighlight === cleanName;

    return (
      <div
        id={id}
        key={cleanName}
        className={`transition-all duration-500 rounded-lg ${isHighlighted ? "agent-highlight" : ""}`}
      >
        {component}
      </div>
    );
  };

  const defaultLayout = [
    "HeroSection",
    "AboutSection",
    "Projects",
    "Skills",
    "Experience",
    "Education",
    "Blog",
    "Github",
    "ContactSection"
  ];

  const layoutToRender = (isAgentMode && Array.isArray(customLayout)) ? customLayout : defaultLayout;

  return (
    <>
      {layoutToRender.map(name => renderComponent(name))}
    </>
  );
}
