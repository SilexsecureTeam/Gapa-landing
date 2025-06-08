import React from "react";
import work from "../assets/work.png";

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
    <div className="py-8 md:py-12 lg:py-16 lg:px-20 md:px-16 sm:px-12 px-8 ">
      <div className="bg-[#333333] rounded-t-lg ">
        <img
          src={work}
          alt="Work"
          className="w-full h-[50vh] md:h-[70vh] object-center object-cover rounded-t-lg"
        />
        <div className="px-4 md:px-8 lg:px-12">
          <h1 className="text-white text-2xl md:text-3xl lg:text-4xl font-semibold md:pt-8 lg:pt-12 pt-4 pb-40">
            How it works
          </h1>
          {/* <div className="relative flex flex-col md:flex-row items-center justify-between gap-10">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center md:text-left md:items-start relative w-full">
              {/* Circle with Number */}
          {/* <div className="relative z-10">
                <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold text-xl mb-4">
                  {step.number}
                </div>
              </div> */}

          {/* Dotted Line (Only for middle steps) */}
          {/* {index !== steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-full w-full border-t-2 border-dotted border-yellow-400"></div>
              )} */}

          {/* Text */}
          {/* <div className="max-w-xs">
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-gray-300">{step.description}</p>
              </div>
            </div>
          ))}
        </div>  */}

          {/* Mobile dotted connector */}
          {/* <div className="md:hidden mt-10 flex items-center justify-center w-full relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 border-t-2 border-dotted border-yellow-400"></div>
        </div> */}
        </div>
      </div>
    </div>
  );
};

export default Work;
