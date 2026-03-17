import React from "react";
import { IoIosPartlySunny } from "react-icons/io";
import { AiOutlineGlobal } from "react-icons/ai";
import { MdOutlineSecurity } from "react-icons/md";
import { SiPythonanywhere } from "react-icons/si";
import { TbPackageExport } from "react-icons/tb";
import { FcAssistant } from "react-icons/fc";
import BrandItem from "./BrandItem";

const Brands = () => {
  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-6 pt-10 px-5 sm:grid-cols-2 lg:grid-cols-3 md:px-0">
      <BrandItem
        title="Private by design"
        text="Notes in Incrypt are tied to your account and kept out of public feeds, so sensitive information stays where it belongs."
        icon={IoIosPartlySunny}
      />{" "}
      <BrandItem
        title="Works wherever you do"
        text="Access your encrypted notes from any device with a browser and keep everything in sync without extra setup."
        icon={AiOutlineGlobal}
      />{" "}
      <BrandItem
        title="Backed by strong security"
        text="Authentication, roles, and access control run in the background so you can focus on writing, not configuration."
        icon={MdOutlineSecurity}
      />{" "}
      <BrandItem
        title="Ready when you are"
        text="Log in, start typing, and pick up right where you left off—no complex onboarding or setup flow required."
        icon={SiPythonanywhere}
      />{" "}
      <BrandItem
        title="Built for important details"
        text="Use Incrypt for the kind of information you don&apos;t want scattered across chat, email, or random files."
        icon={TbPackageExport}
      />{" "}
      <BrandItem
        title="Grows with your usage"
        text="Whether you&apos;re keeping a few personal notes or running a team workspace, Incrypt keeps the experience consistent."
        icon={FcAssistant}
      />
    </div>
  );
};

export default Brands;
