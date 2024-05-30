// @flow strict
import ProjectCard from "../components/homepage/projects/project-card";
import { projectsData } from '@/utils/data/projects-data';
// async function getBlogs() {
//   const res = await fetch(`https://dev.to/api/articles?username=${personalData.devUsername}`)

//   if (!res.ok) {
//     throw new Error('Failed to fetch data')
//   }

//   const data = await res.json();
//   return data;
// };

async function page() {
  //const blogs = await getBlogs();
  // if(blogs.length === 0) {
  //   return <h1 className="text-2xl lg:text-4xl flex justify-center font-bold text-[#604ce0]">No Blogs Found</h1>
  // }
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
};

export default page;