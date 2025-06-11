import React from "react";
import service from "../assets/service.png";
import serve from "../assets/serve.png";
import serve1 from "../assets/serve1.png";
import serve2 from "../assets/serve2.png";
import serve3 from "../assets/serve3.png";
import serve4 from "../assets/serve4.png";
import serve5 from "../assets/serve5.png";

const Serve = () => {
  const services = [
    {
      image: serve,
      title: "Oil Change",
      text: "Keep your engine running smoothly with a quick and efficient oil change.",
    },
    {
      image: serve1,
      title: "Brake Repair",
      text: "Ensuring safe stops with brake inspections and expert repairs.",
    },
    {
      image: serve2,
      title: "Engine Diagnostics",
      text: "Accurately identify and resolve engine issues for optimal performance.",
    },
    {
      image: serve3,
      title: "Battery Replacement",
      text: "Keep your engine running smoothly with a quick and efficient oil change.",
    },
    {
      image: serve4,
      title: "Exhaust System Repair",
      text: "Keep your engine running smoothly with a quick and efficient oil change.",
    },
    {
      image: serve5,
      title: "Tire Services",
      text: "Keep your engine running smoothly with a quick and efficient oil change.",
    },
  ];
  return (
    <div className="bg-[#f3f1f7] py-8 md:py-12 lg:py-16 px-4 sm:px-8 md:px-16 lg:px-20">
      {/* Top Section */}
      <div className="w-full flex flex-col md:flex-row justify-between items-center md:space-x-12 space-y-8 md:space-y-0">
        <div className="w-full md:w-1/2">
          <h1 className=" font-semibold text-2xl text-[#333333] md:text-[40px]">
            Everything <br />
            Your Vehicle Needs
          </h1>
          <p className="md:text-lg text-base text-[#333333] mt-6">
            From your first booking to the final tune-up, we make every service
            count. Our goal is to extend your vehicle’s lifespan with
            professional care and real convenience.
          </p>
          <button className="bg-[#492F92] text-center font-semibold text-xl w-[60%] py-4 text-white my-8 rounded cursor-pointer">
            Request a Call
          </button>
        </div>
        <div className="w-full md:w-1/2">
          <img
            src={service}
            alt="about"
            className="w-full h-auto object-cover rounded"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 space-y-9 pt-20 gap-8">
        {services.map((service, index) => (
          <div
            key={index}
            className="overflow-hidden pb-6 hover:shadow-xl transition-shadow duration-300"
          >
            <div className="aspect-video md:h-70 w-full overflow-hidden">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="">
              <h3 className="text-[22px] font-semibold text-[#333333] mt-3">
                {service.title}
              </h3>
              <p className="text-[#333333] text-lg mt-1 leading-relaxed">
                {service.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Serve;
