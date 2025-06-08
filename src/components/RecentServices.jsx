import React from "react";
import recent from "../assets/recent.png";
import recent1 from "../assets/recent1.png";
import recent2 from "../assets/recent2.png";
import recent3 from "../assets/recent3.png";

const services = [
  {
    src: recent,
    alt: "Tire service",
    cols: "col-span-2 row-span-2",
  },
  {
    src: recent1,
    alt: "Engine repair",
  },
  {
    src: recent2,
    alt: "SUV parked",
  },
  {
    src: recent3,
    alt: "Brake service",
    cols: "col-span-2",
  },
];

const RecentServices = () => {
  return (
    <section className="py-8 md:py-12 lg:py-16 lg:px-20 md:px-16 sm:px-12 px-8">
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#333333] mb-4 md:mb-8">
        Recent Services
      </h2>

      <div className="grid grid-cols-2  md:h-140 md:grid-cols-4 gap-4">
        {services.map((service, idx) => (
          <div
            key={idx}
            className={`overflow-hidden rounded-lg ${
              service.cols ? service.cols : "col-span-1"
            }`}
          >
            <img
              src={service.src}
              alt={service.alt}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecentServices;
