// @flow strict
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';
import BlogCard from './blog-card';
import { personalData } from "@/utils/data/personal-data";
import React, { useEffect, useState } from 'react';
function Blog() {
  const [blogs,setBlogs]=useState([]);
  useEffect(()=>{
    async function getBlogs() {
      const res = await fetch(`https://dev.to/api/articles?username=chintamani_pala`)

      if (!res.ok) {
          throw new Error('Failed to fetch data')
      }
      console.log("res"+res)
      const data = await res.json();
      console.log("data "+data)
      const filtered = data
    .filter(item => item.cover_image)  // Filtering out items that have a cover image
    .sort(() => Math.random() - 0.5); // Shuffling the array randomly
      console.log("the filtered data is"+ filtered)
      setBlogs(filtered)
  };
    getBlogs()
  },[])
  
  
  console.log("the length is "+ blogs.length)
  if (blogs.length === 0) {
    return (
      <div id='blogs' className="relative z-50 border-t my-12 lg:my-24 border-[#25213b]">
        <div className="w-[100px] h-[100px] bg-violet-100 rounded-full absolute top-6 left-[42%] translate-x-1/2 filter blur-3xl  opacity-20"></div>
  
        <div className="flex justify-center -translate-y-[1px]">
          <div className="w-3/4">
            <div className="h-[1px] bg-gradient-to-r from-transparent via-violet-500 to-transparent  w-full" />
          </div>
        </div>
  
        <div className="flex justify-center my-5 lg:py-8">
          <div className="flex  items-center">
            <span className="w-24 h-[2px] bg-[#1a1443]"></span>
            <span className="bg-[#1a1443] w-fit text-white p-2 px-5 text-xl rounded-md">
              Blogs
            </span>
            <span className="w-24 h-[2px] bg-[#1a1443]"></span>
          </div>
        </div>
  
        <span className="text-2xl lg:text-4xl flex justify-center font-bold text-[#604ce0]">No Blogs Found</span>
      </div>
    );
  }
  
  return (
    <div id='blogs' className="relative z-50 border-t my-12 lg:my-24 border-[#25213b]">
      <div className="w-[100px] h-[100px] bg-violet-100 rounded-full absolute top-6 left-[42%] translate-x-1/2 filter blur-3xl  opacity-20"></div>

      <div className="flex justify-center -translate-y-[1px]">
        <div className="w-3/4">
          <div className="h-[1px] bg-gradient-to-r from-transparent via-violet-500 to-transparent  w-full" />
        </div>
      </div>

      <div className="flex justify-center my-5 lg:py-8">
        <div className="flex  items-center">
          <span className="w-24 h-[2px] bg-[#1a1443]"></span>
          <span className="bg-[#1a1443] w-fit text-white p-2 px-5 text-xl rounded-md">
            Blogs
          </span>
          <span className="w-24 h-[2px] bg-[#1a1443]"></span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-5 lg:gap-8 xl:gap-10">
        {
          blogs.slice(0, 6).map((blog, i) => (
            blog?.cover_image &&
            <BlogCard blog={blog} key={i} />
          ))
        }
      </div>

      <div className="flex justify-center  mt-5 lg:mt-12">
        <Link
          className="flex items-center gap-1 hover:gap-3 rounded-full bg-gradient-to-r from-pink-500 to-violet-600 px-3 md:px-8 py-3 md:py-4 text-center text-xs md:text-sm font-medium uppercase tracking-wider text-white no-underline transition-all duration-200 ease-out hover:text-white hover:no-underline md:font-semibold"
          role="button"
          href="/blog"
        >
          <span>View More</span>
          <FaArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export default Blog;
