// @flow strict
import ProjectCard from "../components/homepage/projects/project-card";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

async function getProjects() {
  const res = await fetch('/api/portfolio', {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch projects');
  }

  const json = await res.json();
  const items = json.projects || [];
  return items.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description || "",
    tools: Array.isArray(p.tools) ? p.tools : [],
    role: p.role || "",
    links: (p.links || [])
      .filter((l) => l.url)
      .sort((a, b) => (a.display_order || 0) - (b.display_order || 0)),
  }));
}

export default async function page() {
  const projectsData = await getProjects();

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
          projectsData.map((project, i) => (
            <ProjectCard project={project} key={i}/>
          ))
        } 
      </div>
    </div>
  );
}