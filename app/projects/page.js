// @flow strict
import ProjectCard from "../components/homepage/projects/project-card";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

async function getProjects() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const res = await fetch(`${baseUrl}/api/v1/admin/portfolio/snapshot`, {
    headers: {
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN || ''}`,
    },
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch projects');
  }

  const json = await res.json();
  const items = json.data?.projects || [];
  return items.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description || "",
    tools: Array.isArray(p.tools) ? p.tools : [],
    role: p.role || "",
    code: "",
    demo: "",
    github: p.links?.find((l) => l.type === "github")?.url || "",
    live: p.links?.find((l) => l.type === "live")?.url || "",
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