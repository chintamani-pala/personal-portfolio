"use client";
import React from "react";

function Shimmer({ className = "" }) {
  return (
    <div className={`animate-pulse bg-gray-700/50 rounded ${className}`} />
  );
}

export function HeroShimmer() {
  return (
    <section className="relative flex flex-col items-center justify-between py-4 lg:py-12">
      <div className="grid grid-cols-1 items-start lg:grid-cols-2 lg:gap-12 gap-y-8 w-full">
        <div className="order-2 lg:order-1 flex flex-col items-start justify-center p-2 pb-20 md:pb-10 lg:pt-10 space-y-4">
          <Shimmer className="h-8 w-64" />
          <Shimmer className="h-8 w-48" />
          <Shimmer className="h-6 w-32" />
          <div className="flex items-center gap-5 mt-4">
            {[1,2,3,4,5].map(i => (
              <Shimmer key={i} className="h-8 w-8 rounded-full" />
            ))}
          </div>
          <div className="flex items-center gap-3 mt-6">
            <Shimmer className="h-12 w-32 rounded-full" />
            <Shimmer className="h-12 w-32 rounded-full" />
          </div>
        </div>
        <div className="flex justify-center order-1 lg:order-2">
          <Shimmer className="w-64 h-64 lg:w-80 lg:h-80 rounded-lg" />
        </div>
      </div>
    </section>
  );
}

export function AboutShimmer() {
  return (
    <div id="about" className="my-12 lg:my-16 relative">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-16">
        <div className="order-1 lg:order-2 lg:col-span-3 space-y-4">
          <Shimmer className="h-6 w-32" />
          <Shimmer className="h-4 w-full" />
          <Shimmer className="h-4 w-full" />
          <Shimmer className="h-4 w-3/4" />
        </div>
        <div className="flex justify-center order-2 lg:order-1 lg:col-span-2">
          <Shimmer className="w-64 h-64 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function SkillsShimmer() {
  return (
    <div id="skills" className="relative z-50 border-t my-12 lg:my-24 border-[#25213b]">
      <div className="flex justify-center my-5 lg:py-8">
        <Shimmer className="h-8 w-32" />
      </div>
      <div className="flex flex-wrap justify-center gap-4 mt-8">
        {[1,2,3,4,5,6,7,8].map(i => (
          <Shimmer key={i} className="h-20 w-32 rounded-lg" />
        ))}
      </div>
    </div>
  );
}

export function ProjectsShimmer() {
  return (
    <div id="projects" className="relative z-50 my-12 lg:my-24">
      <div className="flex justify-center my-5 lg:py-8">
        <Shimmer className="h-8 w-32" />
      </div>
      <div className="flex flex-col gap-6 mt-8">
        {[1,2,3].map(i => (
          <div key={i} className="w-full max-w-2xl mx-auto">
            <Shimmer className="h-48 w-full rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ExperienceShimmer() {
  return (
    <div id="experience" className="relative z-50 border-t my-12 lg:my-24 border-[#25213b]">
      <div className="flex justify-center my-5 lg:py-8">
        <Shimmer className="h-8 w-32" />
      </div>
      <div className="flex flex-col gap-6 mt-8">
        {[1,2,3].map(i => (
          <div key={i} className="p-6 rounded-lg border border-[#1f223c] bg-[#11152c]">
            <Shimmer className="h-4 w-32 mb-4" />
            <Shimmer className="h-6 w-48 mb-2" />
            <Shimmer className="h-4 w-32 mb-4" />
            <Shimmer className="h-4 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function EducationShimmer() {
  return (
    <div id="education" className="relative z-50 border-t my-12 lg:my-24 border-[#25213b]">
      <div className="flex justify-center my-5 lg:py-8">
        <Shimmer className="h-8 w-32" />
      </div>
      <div className="flex flex-col gap-6 mt-8">
        {[1,2,3].map(i => (
          <div key={i} className="p-6 rounded-lg border border-[#1f223c] bg-[#11152c]">
            <Shimmer className="h-4 w-32 mb-4" />
            <Shimmer className="h-6 w-48 mb-2" />
            <Shimmer className="h-4 w-32" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ContactShimmer() {
  return (
    <div id="contact" className="my-12 lg:my-16 relative mt-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        <div className="space-y-4">
          {[1,2,3].map(i => (
            <div key={i} className="flex items-center gap-3">
              <Shimmer className="h-10 w-10 rounded-full" />
              <Shimmer className="h-6 w-48" />
            </div>
          ))}
          <div className="flex items-center gap-5 lg:gap-10 mt-8">
            {[1,2,3,4,5].map(i => (
              <Shimmer key={i} className="h-12 w-12 rounded-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function GithubShimmer() {
  return (
    <div id="education" className="relative z-50 border-t my-12 lg:my-24 border-[#25213b]">
      <div className="flex justify-center my-5 lg:py-8">
        <Shimmer className="h-8 w-32" />
      </div>
      <div className="flex justify-center">
        <Shimmer className="h-32 w-full max-w-2xl rounded-lg" />
      </div>
    </div>
  );
}

export { Shimmer };
