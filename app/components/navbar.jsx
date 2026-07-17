"use client";
// @flow strict
import Link from "next/link";
import { personalData } from "@/utils/data/personal-data";
import { useAgentMode } from "@/context/AgentModeContext";

function Navbar() {
  const { isAgentMode, toggleAgentMode } = useAgentMode();

  return (
    <>
    <div className="sticky top-0">
    <div className="absolute top-[80vh] left-0 animated-wrapper filter blur-3xl z-20">
      <div className="w-24 h-24 rounded-full border-4 border-white fixed glow" style={{ left: '20%', transform: 'translate(-50%, -50%)' }}></div>
    </div>
    </div>
    <nav className="bg-transparent">
      <div className="flex items-center justify-between py-5">
        <div className="flex flex-shrink-0 items-center">
          <Link
            href="/"
            className=" text-[#16f2b3] lg:text-3xl md:text-2xl text-sm font-bold">
            {personalData.name}
          </Link>
        </div>

        <ul className="mt-4 flex h-screen max-h-0 w-full flex-col items-center text-sm opacity-0 md:mt-0 md:h-auto md:max-h-screen md:w-auto md:flex-row md:space-x-1 md:border-0 md:opacity-100" id="navbar-default">
          <li>
            <Link className="block px-4 py-2 no-underline outline-none hover:no-underline" href="/#about">
              <div className="text-sm text-white transition-colors duration-300 hover:text-pink-600 font-semibold">ABOUT</div>
            </Link>
          </li>
          <li>
            <Link className="block px-4 py-2 no-underline outline-none hover:no-underline" href="/#experience"><div className="text-sm text-white transition-colors duration-300 hover:text-pink-600 font-semibold">EXPERIENCE</div></Link>
          </li>
          <li>
            <Link className="block px-4 py-2 no-underline outline-none hover:no-underline" href="/#skills"><div className="text-sm text-white transition-colors duration-300 hover:text-pink-600 font-semibold">SKILLS</div></Link>
          </li>
          <li>
            <Link className="block px-4 py-2 no-underline outline-none hover:no-underline" href="/#education"><div className="text-sm text-white transition-colors duration-300 hover:text-pink-600 font-semibold">EDUCATION</div></Link>
          </li>
          <li>
            <Link className="block px-4 py-2 no-underline outline-none hover:no-underline" href="/blog"><div className="text-sm text-white transition-colors duration-300 hover:text-pink-600 font-semibold">BLOGS</div></Link>
          </li>
          <li>
            <Link className="block px-4 py-2 no-underline outline-none hover:no-underline" href="/#projects"><div className="text-sm text-white transition-colors duration-300 hover:text-pink-600 font-semibold">PROJECTS</div></Link>
          </li>
          <li>
            <button
              onClick={toggleAgentMode}
              className="ml-2 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-pink-500 to-violet-600 hover:from-pink-600 hover:to-violet-700 px-4 py-2 text-center text-xs font-semibold uppercase tracking-wider text-white no-underline transition-all duration-300 ease-out hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(236,72,153,0.4)] border border-pink-400/20"
            >
              {isAgentMode ? "✨ Exit Agent Mode" : "✨ Launch AI Operator"}
            </button>
          </li>
        </ul>
      </div>
    </nav>
    </>
  );
};

export default Navbar;




