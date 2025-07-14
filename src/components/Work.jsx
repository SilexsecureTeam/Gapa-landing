import React from "react";
import work from "../assets/work.png";
import HowItWorks from "./HowItWorks";

// const steps = [
//   {
//     number: 1,
//     title: "Book a Service",
//     description: "Lorem ipsum dolor sit amet consectetur. pretium egestas vel.",
//   },
//   {
//     number: 2,
//     title: "Bring Your Car",
//     description: "Lorem ipsum dolor sit amet consectetur. pretium egestas vel.",
//   },
//   {
//     number: 3,
//     title: "Get Serviced",
//     description: "Lorem ipsum dolor sit amet consectetur. pretium egestas vel.",
//   },
// ];

const Work = () => {
  return (
    <div className="py-8 md:py-12 lg:py-16 lg:px-20 md:px-16 sm:px-12 px-4 ">
      <div className="bg-[#333333] pb-10 rounded-t-lg ">
        <img
          src={work}
          alt="Work"
          className="w-full h-[50vh] md:h-[70vh] object-top object-cover rounded-t-lg"
        />
        <div className="p-4 md:p-8 lg:p-12">
          <h1 className="text-white text-center md:text-start text-2xl md:text-3xl lg:text-4xl font-semibold md:pt-8 lg:pt-12 pt-4 pb-15">
            How it works
          </h1>
          <HowItWorks />
        </div>
      </div>
    </div>
  );
};

export default Work;
