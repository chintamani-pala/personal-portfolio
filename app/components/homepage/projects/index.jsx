"use client";

import React from "react";
import { projectsData } from "@/utils/data/projects-data";
import ProjectCard from "./project-card";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import { useAgentMode } from "@/context/AgentModeContext";
import "../../../css/globals.scss";

const Projects = () => {
  const { projectFilter, activeHighlight } = useAgentMode();

  const getSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const filteredProjects = projectsData.filter((project) => {
    if (!projectFilter) return true;
    const query = projectFilter.toLowerCase();
    return (
      project.name.toLowerCase().includes(query) ||
      project.description.toLowerCase().includes(query) ||
      project.tools.some((tool) => tool.toLowerCase().includes(query))
    );
  });

  return (
    <div id="projects" className="relative z-50 my-12 lg:my-24">
      <div className="stick top-3">
        <div className="w-[80px] h-[80px] bg-violet-100 rounded-full absolute -top-3 left-0 translate-x-1/2 filter blur-3xl opacity-30"></div>
        <div className="flex justify-center">
          <div className="flex items-center">
            <span className="w-24 h-[2px] bg-[#1a1443]"></span>
            <span className="bg-[#1a1443] w-fit text-white p-2 px-5 text-xl rounded-md">
              Projects
            </span>
            <span className="w-24 h-[2px] bg-[#1a1443]"></span>
          </div>
        </div>
      </div>

      <div className="pt-10">
        <div className="flex flex-col gap-6">
          {filteredProjects.map((project, index) => {
            const slug = getSlug(project.name);
            const isHighlighted = activeHighlight === slug;

            return (
              <div
                id={slug}
                key={project.id || index}
                className={`w-full mx-auto max-w-2xl transition-all duration-500 rounded-lg p-1 ${
                  isHighlighted ? "agent-highlight" : ""
                }`}
              >
                <div className="box-border flex items-center justify-center rounded shadow-[0_0_30px_0_rgba(0,0,0,0.3)] transition-all duration-[0.5s] bg-[#0d1224]">
                  <ProjectCard project={project} />
                </div>
              </div>
            );
          })}
          {filteredProjects.length === 0 && (
            <p className="text-center text-gray-500 text-sm mt-4">
              No projects found matching current filter.
            </p>
          )}
        </div>
      </div>

      {!projectFilter && (
        <div className="flex justify-center mt-5 lg:mt-12">
          <Link
            className="flex items-center gap-1 hover:gap-3 rounded-full bg-gradient-to-r from-pink-500 to-violet-600 px-3 md:px-8 py-3 md:py-4 text-center text-xs md:text-sm font-medium uppercase tracking-wider text-white no-underline transition-all duration-200 ease-out hover:text-white hover:no-underline md:font-semibold"
            role="button"
            href="/projects"
          >
            <span>View More</span>
            <FaArrowRight size={16} />
          </Link>
        </div>
      )}
    </div>
  );
};

export default Projects;
