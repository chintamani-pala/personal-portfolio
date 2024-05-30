// @flow strict
import Image from "next/image";
import GitHubCalendar from "react-github-calendar";
import { personalData } from "@/utils/data/personal-data";

function Github() {
  return (
    <div id="education" className="relative z-50 border-t my-12 lg:my-24 border-[#25213b]">
      <Image
        src="/section.svg"
        alt="Hero"
        width={1572}
        height={795}
        className="absolute top-0 -z-10"
      />
      <div className="flex justify-center -translate-y-[1px]">
        <div className="w-3/4">
          <div className="h-[1px] bg-gradient-to-r from-transparent via-violet-500 to-transparent  w-full" />
        </div>
      </div>

      <div className="flex justify-center my-5 lg:py-8">
        <div className="flex  items-center">
          <span className="w-24 h-[2px] bg-[#1a1443]"></span>
          <span className="bg-[#1a1443] w-fit text-white p-2 px-5 text-xl rounded-md">
            Github
          </span>
          <span className="w-24 h-[2px] bg-[#1a1443]"></span>
        </div>
      </div>
      <span className="project-heading flex justify-center text-3xl">
        <strong className="yellow">{personalData.name}</strong>
      </span>
      <br />
      <div className="pb-6 pt-2 mx-auto my-auto flex justify-center">
      
      <GitHubCalendar
        username={personalData.githubUserName}
        blockSize={15}
        blockMargin={5}
        color="#6102ce"
        fontSize={16}
      />
      </div>
    </div>
  );
};

export default Github;