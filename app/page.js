// import { personalData } from "@/utils/data/personal-data";
// import AboutSection from "./components/homepage/about";
// import Blog from "./components/homepage/blog";
// import ContactSection from "./components/homepage/contact";
// import Education from "./components/homepage/education";
// import Experience from "./components/homepage/experience";
// import HeroSection from "./components/homepage/hero-section";
// import Projects from "./components/homepage/projects";
// import Skills from "./components/homepage/skills";
// import Github from "./components/homepage/github";

// async function getData() {
//   const res = await fetch(`https://dev.to/api/articles?username=${personalData.devUsername}`)

//   if (!res.ok) {
//     throw new Error('Failed to fetch data')
//   }

//   const data = await res.json();

//   const filtered = data.filter((item) => item?.cover_image).sort(() => Math.random() - 0.5);

//   return filtered;
// };



// export default async function Home() {
//   const blogs = await getData();
 



//   return (
//     <>
//       <HeroSection />
//       <AboutSection />
//       <Projects />
//       <Skills />
//       <Experience />
//       <Education />
//       <Blog blogs={blogs} />
//       <Github />
//       <ContactSection />
//     </>
//   )
// };






"use client"
import React, { useEffect, useState } from 'react';
import { personalData } from "@/utils/data/personal-data";
import AboutSection from "./components/homepage/about";
import Blog from "./components/homepage/blog";
import ContactSection from "./components/homepage/contact";
import Education from "./components/homepage/education";
import Experience from "./components/homepage/experience";
import HeroSection from "./components/homepage/hero-section";
import Projects from "./components/homepage/projects";
import Skills from "./components/homepage/skills";
import Github from "./components/homepage/github";
import security from "./security"

async function getData() {
  const res = await fetch(`https://dev.to/api/articles?username=${personalData.devUsername}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();

  // Filtering out items that have a cover image

  return filtered;
}

export default function Home() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const blogsData = await getData();
      setBlogs(blogsData);
    }
    fetchData();
    security()
  }, []);

  return (
    <>
      <HeroSection />
      <AboutSection />
      <Projects />
      <Skills />
      <Experience />
      <Education />
      <Blog blogs={blogs} />
      <Github />
      <ContactSection />
    </>
  );
}
