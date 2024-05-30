// @flow strict

import { personalData } from "@/utils/data/personal-data";
import Image from "next/image";

function AboutSection() {
  return (
    <div id="about" className="my-12 lg:my-16 relative">
      <div className="hidden lg:flex flex-col items-center absolute top-16 -right-8">
        <span className="bg-[#1a1443] w-fit text-white rotate-90 p-2 px-5 text-xl rounded-md">
          ABOUT ME
        </span>
        <span className="h-36 w-[2px] bg-[#1a1443]"></span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-16">
        <div className="order-1 lg:order-2 lg:col-span-3 lg:mr-20 md:mr-0">
          <p className="font-medium mb-5 text-[#16f2b3] text-xl uppercase hidden lg:block">
            Who I am?
          </p>
          <div className="flex items-center lg:hidden mx-auto my-auto justify-center">
            <span className="w-24 h-[2px] bg-[#1a1443]"></span>
            <span className="bg-[#1a1443] w-fit text-white p-2 px-5 text-xl rounded-md">
              About Me
            </span>
            <span className="w-24 h-[2px] bg-[#1a1443]"></span>
          </div>
          <br className="lg:hidden block"/>
          <p className="text-gray-200 text-sm lg:text-lg">
            {personalData.description}
          </p>
        </div>
        <div className="flex justify-center order-2 lg:order-1 lg:col-span-2">
          <Image
            src={personalData.profile2}
            width={280}
            height={280}
            alt={personalData.name}
            className="rounded-lg transition-all duration-1000 grayscale hover:grayscale-0 hover:scale-110 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}

export default AboutSection;
