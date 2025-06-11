import React from "react";

const steps = [
  {
    id: 1,
    title: "Book a Service",
    description: "Lorem ipsum dolor sit amet consectetur. Pretium egestas vel.",
  },
  {
    id: 2,
    title: "Bring Your Car",
    description: "Lorem ipsum dolor sit amet consectetur. Pretium egestas vel.",
  },
  {
    id: 3,
    title: "Get Serviced",
    description: "Lorem ipsum dolor sit amet consectetur. Pretium egestas vel.",
  },
];

const HowItWorks = () => {
  return (
    <div className=" text-white ">
      <div className="relative flex flex-col md:flex-row items-start justify-between w-full">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className="relative z-10 flex flex-col items-start text-center w-full md:w-1/3 mb-12 md:mb-0"
          >
            <div className="bg-yellow-400 text-black w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold shadow-md">
              {step.id}
            </div>

            {/* Horizontal connector line only between middle steps on desktop */}
            {index < steps.length - 1 && (
              <div className="hidden md:block absolute top-8 right-[-50%] w-full h-0.5 border-t border-dashed border-yellow-400 z-0" />
            )}

            <h3 className="text-lg font-semibold mt-4">{step.title}</h3>
            <p className="text-sm text-start mt-2 max-w-xs">
              {step.description}
            </p>

            {/* Dashed connector line for small screens */}
            {index < steps.length - 1 && (
              <div className="block md:hidden w-1 h-12 border-l border-dashed border-yellow-400 mt-4"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowItWorks;
