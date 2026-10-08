"use client"
import React, { useEffect, useMemo, useState } from 'react';
import { personalData } from "@/utils/data/personal-data";
import { skillsData } from "@/utils/data/skills";
import { projectsData } from "@/utils/data/projects-data";
import { experiences } from "@/utils/data/experience";
import { educations } from "@/utils/data/educations";
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
import Chatbot from "./components/chatbot/Chatbot";
import { HeroShimmer, AboutShimmer, SkillsShimmer, ProjectsShimmer, ExperienceShimmer, EducationShimmer, ContactShimmer, GithubShimmer } from "./components/shimmer";

export default function Home() {
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);

  const mergedPersonalData = useMemo(() => {
    const base = { ...personalData };
    if (portfolioData) {
      const profile = portfolioData.profile || {};
      base.name = profile.name || base.name;
      base.profile = profile.profile_image || base.profile;
      base.profile2 = profile.profile_image_2 || base.profile2;
      base.description = profile.description || base.description;
      base.githubUserName = profile.github_username || base.githubUserName;
      base.devUsername = profile.dev_username || base.devUsername;
      base.resume = profile.resume_url || base.resume;
      base.leetcode = profile.leetcode_url || base.leetcode;

      const contact = portfolioData.contact || {};
      base.email = contact.email || base.email;
      base.phone = contact.phone || base.phone;
      base.address = contact.address || base.address;

      const professions = portfolioData.professions || [];
      if (professions.length) {
        base.profession = professions.map((p) => p.profession);
      }

      const socialLinks = portfolioData.social_links || [];
      if (socialLinks.length) {
        const links = {};
        socialLinks.forEach((link) => {
          links[link.platform] = link.url;
        });
        if (links.github) base.github = links.github;
        if (links.linkedin) base.linkedIn = links.linkedin;
        if (links.facebook) base.facebook = links.facebook;
        if (links.twitter) base.twitter = links.twitter;
        if (links.stackoverflow) base.stackOverflow = links.stackoverflow;
      }
    }
    return base;
  }, [portfolioData]);

  const mergedSkills = useMemo(() => {
    if (portfolioData?.skills?.length) {
      return portfolioData.skills.map((s) => s.name);
    }
    return skillsData;
  }, [portfolioData]);

  const mergedFeaturedProjects = useMemo(() => {
    if (portfolioData?.projects?.length) {
      const featured = portfolioData.projects.filter((p) => p.featured).slice(0, 4);
      return featured.map((p) => ({
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
    return [];
  }, [portfolioData]);

  const mergedExperiences = useMemo(() => {
    if (portfolioData?.experiences?.length) {
      return portfolioData.experiences
        .filter((e) => !e.featured)
        .map((e) => ({
          id: e.id,
          title: e.title,
          company: e.company,
          duration: `${e.start_date || ""} - ${e.is_current ? "Present" : e.end_date || ""}`,
          description: e.descriptions?.map((d) => d.description) || [],
        }));
    }
    return experiences;
  }, [portfolioData]);

  const mergedFeaturedExperiences = useMemo(() => {
    if (portfolioData?.experiences?.length) {
      return portfolioData.experiences
        .filter((e) => e.featured)
        .map((e) => ({
          id: e.id,
          title: e.title,
          company: e.company,
          duration: `${e.start_date || ""} - ${e.is_current ? "Present" : e.end_date || ""}`,
          description: e.descriptions?.map((d) => d.description) || [],
        }));
    }
    return [];
  }, [portfolioData]);

  const mergedEducations = useMemo(() => {
    if (portfolioData?.education?.length) {
      return portfolioData.education.map((e) => ({
        id: e.id,
        title: e.title,
        duration: `${e.start_year || ""} - ${e.end_year || ""}`,
        institution: e.institution,
        status: e.status,
      }));
    }
    return educations;
  }, [portfolioData]);

  useEffect(() => {
    security();
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const res = await fetch('/api/portfolio/cached');
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data && data.cached !== false) {
            setPortfolioData(data);
            setLoading(false);
          }
        }
      } catch (error) {
        console.error("Failed to load cached portfolio data:", error);
      }

      try {
        await fetch('/api/portfolio');
      } catch (error) {
        console.error("Failed to refresh portfolio data:", error);
      }
      finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <>
        <HeroShimmer />
        <AboutShimmer />
        <ProjectsShimmer />
        <SkillsShimmer />
        <ExperienceShimmer />
        <EducationShimmer />
        <GithubShimmer />
        <ContactShimmer />
    {/*<Chatbot />*/}
      </>
    );
  }

  return (
    <>
      <HeroSection data={mergedPersonalData} />
      <AboutSection data={mergedPersonalData} />
      <Projects data={mergedFeaturedProjects} />
      <Skills data={mergedSkills} />
      {mergedFeaturedExperiences.length > 0 && <Experience data={mergedFeaturedExperiences} title="Featured Experiences" />}
      <Experience data={mergedExperiences} />
      <Education data={mergedEducations} />
      <Blog data={mergedPersonalData} />
      <Github data={mergedPersonalData} />
      <ContactSection data={mergedPersonalData} />
  {/*<Chatbot />*/}
    </>
  );
}
