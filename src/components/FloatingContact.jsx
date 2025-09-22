import React, { useState } from "react";
import { Headset, X } from "lucide-react";

const FloatingContact = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return null; // Don't render if not visible
  }

  return (
    <div className="fixed bg-[#492F92]/80 px-6 py-3 rounded-md bottom-6 right-6 z-50 flex items-center justify-between space-x-4">
      <a
        href="tel:+2347018888307"
        className="flex items-center justify-center bg-[#492F92] text-white rounded-full p-3 shadow-lg hover:bg-[#F7CD3A] hover:text-[#492F92] transition-colors duration-300"
        aria-label="Call us at (234) 701 888 8307"
      >
        <Headset className="w-7 h-7" />
      </a>
      <div className="mt-2 text-sm font-medium text-white rounded px-2 py-1 shadow flex flex-col">
        <p className="mb-1 text-sm md:text-lg">Got questions? call us</p>
        <a
          href="tel:+2347018888307"
          className="hover:underline text-sm md:text-base"
        >
          07088885268
        </a>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="text-white hover:text-[#F7CD3A] transition-colors duration-300 p-1 ml-2"
        aria-label="Close contact widget"
      >
        <X className="w-5 h-5 cursor-pointer absolute top-2 right-4" />
      </button>
    </div>
  );
};

export default FloatingContact;
