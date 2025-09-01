import React from "react";
import { Headset } from "lucide-react";

const FloatingContact = () => {
  return (
    <div className="fixed bg-[#492F92]/80 px-6 py-3 rounded-md bottom-6 right-6 z-50 flex  items-center justify-between space-x-4">
      <a
        href="tel:+2347018888307"
        className="flex items-center justify-center bg-[#492F92] text-white rounded-full p-3 shadow-lg hover:bg-[#F7CD3A] hover:text-[#492F92] transition-colors duration-300"
        aria-label="Call us at (234) 701 888 8307"
      >
        <Headset className="w-7 h-7" />
      </a>
      <div className="mt-2 text-sm font-medium text-white  rounded px-2 py-1 shadow">
        <p className="mb-1 text-sm md:text-lg">Got questions? call us</p>
        <a
          href="tel:+2347018888307"
          className="hover:underline text-sm md:text-base"
        >
          (234) 701 888 8307
        </a>
      </div>
    </div>
  );
};

export default FloatingContact;
