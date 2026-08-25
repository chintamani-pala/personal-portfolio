// @flow strict

import Experience from "../components/homepage/experience";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

async function getExperiences() {
  const res = await fetch('/api/portfolio', {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch experiences');
  }

  const json = await res.json();
  const items = json.experiences || [];
  return items.map((e) => ({
    id: e.id,
    title: e.title,
    company: e.company,
    duration: `${e.start_date || ""} - ${e.is_current ? "Present" : e.end_date || ""}`,
    description: e.descriptions?.map((d) => d.description) || [],
  }));
}

export default async function page() {
  const experiencesData = await getExperiences();

  return (
    <div className="py-8">
      <div className="flex justify-center my-5 lg:py-8">
        <div className="flex  items-center">
          <span className="w-24 h-[2px] bg-[#1a1443]"></span>
          <span className="bg-[#1a1443] w-fit text-white p-2 px-5 lg:text-2xl md:text-xl text-sm rounded-md">
            All Experiences
          </span>
          <span className="w-24 h-[2px] bg-[#1a1443]"></span>
        </div>
      </div>
      <div className="max-w-4xl mx-auto">
        <Experience data={experiencesData} title="All Experiences" />
      </div>
      <div className="flex justify-center  mt-5 lg:mt-12">
        <Link
          className="flex items-center gap-1 hover:gap-3 rounded-full bg-gradient-to-r from-pink-500 to-violet-600 px-3 md:px-8 py-3 md:py-4 text-center text-xs md:text-sm font-medium uppercase tracking-wider text-white no-underline transition-all duration-200 ease-out hover:text-white hover:no-underline md:font-semibold"
          role="button"
          href="/"
        >
          <span>Back to Home</span>
          <FaArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
