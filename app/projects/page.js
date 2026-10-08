// @flow strict
"use client";

import { useEffect, useState } from "react";
import ProjectCard from "../components/homepage/projects/project-card";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/portfolio/cached');
        if (res.ok) {
          const data = await res.json();
          const items = data.projects || [];
          setProjects(items.map((p) => ({
            id: p.id,
            name: p.name,
            description: p.description || "",
            tools: Array.isArray(p.tools) ? p.tools : [],
            role: p.role || "",
            links: (p.links || [])
              .filter((l) => l.url)
              .sort((a, b) => (a.display_order || 0) - (b.display_order || 0)),
          })));
        }
      } catch (error) {
        console.error("Failed to fetch projects from cache:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return <div className="py-8 flex justify-center"><p>Loading projects...</p></div>;
  }

  return (
    <div className="py-8">
      <div className="flex justify-center my-5 lg:py-8">
        <div className="flex  items-center">
          <span className="w-24 h-[2px] bg-[#1a1443]"></span>
          <span className="bg-[#1a1443] w-fit text-white p-2 px-5 lg:text-2xl md:text-xl text-sm rounded-md">
            All Projects
          </span>
          <span className="w-24 h-[2px] bg-[#1a1443]"></span>
        </div>
      </div>
       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-3 md:gap-5 lg:gap-8 xl:gap-10">
        {
          projects.map((project, i) => (
            <ProjectCard project={project} key={i}/>
          ))
        } 
      </div>
    </div>
  );
}

export default ProjectsPage;
