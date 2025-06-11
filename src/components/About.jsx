import React from "react";
import about from "../assets/about.png";
import about2 from "../assets/about2.png";
const About = () => {
  const data = [
    {
      title: "Our Mission",
      subtitle:
        "To provide convenient, dependable car repair and maintenance services through a seamless booking experience.",
    },
    {
      title: "Our Vision",
      subtitle:
        "To provide convenient, dependable car repair and maintenance services through a seamless booking experience.",
    },
    {
      title: "Our Value",
      subtitle:
        "To provide convenient, dependable car repair and maintenance services through a seamless booking experience.",
    },
  ];
  return (
    <div className="bg-[#f3f1f7] py-8 md:py-12 lg:py-16 lg:px-20 md:px-16 sm:px-12 px-4">
      <div className="w-full flex justify-between md:space-x-12">
        <div className="w-full md:w-1/2">
          <h1 className="max-w-[350px] font-semibold text-2xl text-[#333333] md:text-[40px]">
            Who We Are, What Drives Us
          </h1>
          <p className="md:text-lg text-base text-[#333333] mt-6">
            At Gapa, we make car care simple and stress-free. Whether it's
            routine maintenance, emergency repairs, or service bookings, our
            platform connects drivers with trusted auto experts — fast,
            reliable, and right when you need it.
          </p>
          <button className="bg-[#492F92] text-center font-semibold text-xl w-[60%] py-5 text-[#f5f5f5] my-10 rounded cursor-pointer">
            Book us
          </button>
        </div>
        <img src={about} alt="about" className="w-full md:w-1/2 h-90" />
      </div>
      <div className="flex justify-center items-center space-x-20 py-20 w-full">
        {data.map((item, index) => (
          <div key={index} className=" w-full md:w-1/3">
            <h2 className="text-2xl md:text-4xl font-medium mb-4 text-[#333333]">
              {item.title}
            </h2>
            <h4 className=" text-[#333333]">{item.subtitle}</h4>
          </div>
        ))}
      </div>
      <div className="w-full flex justify-between md:space-x-12">
        <img src={about2} alt="about" className="w-full md:w-1/2 h-90" />
        <div className="w-full md:w-1/2">
          <h1 className=" font-semibold text-2xl text-[#492F92] md:text-[40px]">
            Your Journey to Reliable Car Care
          </h1>
          <p className="md:text-lg text-base text-[#333333] mt-6">
            At Gapa, we make car care simple and stress-free. Whether it's
            routine maintenance, emergency repairs, or service bookings, our
            platform connects drivers with trusted auto experts — fast,
            reliable, and right when you need it.
          </p>
          {/* <button className="bg-[#492F92] text-center font-semibold text-xl w-[60%] py-5 text-[#f5f5f5] my-10 rounded cursor-pointer">
            Book us
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default About;
