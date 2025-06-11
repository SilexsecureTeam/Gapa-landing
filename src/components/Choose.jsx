import React from "react";
import { CalendarClock, Shield, Sliders } from "lucide-react";
import about3 from "../assets/about3.png";
import about4 from "../assets/about4.png";
import about5 from "../assets/about5.png";

const Choose = () => {
  const features = [
    {
      icon: CalendarClock,
      title: "Fast & Easy Booking",
      text: "Schedule maintenance or repairs in minutes — no calls, no stress.",
    },
    {
      icon: Shield,
      title: "Verified Technicians",
      text: "All service providers are vetted for quality, professionalism, and trust.",
    },
    {
      icon: Sliders,
      title: "Flexible Service Options",
      text: "Whether at home, on the road, or in the shop. we meet you where you are.",
    },
  ];
  const data = [
    {
      image: about3,
      title: "Yemi Johnson",
      subtitle: "Lead Mechanic",
    },
    {
      image: about4,
      title: "Chidibere Nonso",

      subtitle: "Tire and brake Specialist",
    },
    {
      image: about5,

      title: "Sani Yakubu",
      subtitle: "Lead Electrician",
    },
  ];

  return (
    <div>
      <div className="bg-[#333333] text-white w-full lg:px-20 md:px-16 sm:px-12 px-4">
        <h2 className="font-semibold text-2xl py-3 md:text-[40px]">
          Why Choose Gapa?
        </h2>
        <h2 className="font-normal text-lg  md:text-2xl">
          Smart. Reliable. Hassle-Free.
        </h2>
        <div className="flex justify-between flex-col pb-30 lg:flex-row gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="max-w-[322px] mt-16  text-white  hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex  mb-4 ">
                  <div className="w-16 h-16 mb-6 rounded-full flex ">
                    <IconComponent className="w-8 h-8 md:w-16 md:h-16 text-[#F7CD3A]" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold  mb-1">{feature.title}</h3>
                <p className="text-[17px] font-normal leading-relaxed">
                  {feature.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
      <div className="pb-8 md:pb-12 lg:pb-16 pt-6 px-4 sm:px-8 md:px-16 lg:px-20">
        <div className="flex flex-col md:flex-row justify-center items-start md:items-center gap-8 md:gap-12 pt-6 ">
          {data.map((item, index) => (
            <div key={index} className="w-full md:w-1/3 text-center">
              <img src={item.image} alt={item.title} />
              <h2 className="text-[22px] font-medium mt-4 text-[#333333]">
                {item.title}
              </h2>
              <h4 className="text-[#333333] text-lg">{item.subtitle}</h4>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Choose;
