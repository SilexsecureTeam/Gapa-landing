import React from "react";
import about from "../assets/about.png";
import about2 from "../assets/about2.png";
import brand from "../assets/brand.png";
import brand1 from "../assets/brand1.png";
import brand2 from "../assets/brand2.png";
import brand3 from "../assets/brand3.png";
import brand4 from "../assets/brand4.png";

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

  // Brand logos data - you can replace these with your actual brand logos
  const brands = [
    {
      id: 1,
      name: "Toyota",
      logo: brand,
    },
    {
      id: 2,
      name: "Honda",
      logo: brand1,
    },
    {
      id: 3,
      name: "Ford",
      logo: brand2,
    },
    {
      id: 4,
      name: "BMW",
      logo: brand3,
    },
    {
      id: 5,
      name: "Mercedes",
      logo: brand4,
    },
  ];

  // Duplicate the brands array for seamless infinite scroll
  const duplicatedBrands = [...brands, ...brands];

  return (
    <div className="bg-[#f3f1f7] py-8 md:py-12 lg:py-16 px-4 sm:px-8 md:px-16 lg:px-20">
      {/* Top Section */}
      <div className="w-full flex flex-col md:flex-row justify-between items-center md:space-x-12 space-y-8 md:space-y-0">
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
          <button className="bg-[#492F92] text-center font-semibold text-xl w-[60%] py-4 text-white my-8 rounded cursor-pointer">
            Book us
          </button>
        </div>
        <div className="w-full md:w-1/2">
          <img
            src={about}
            alt="about"
            className="w-full h-auto object-cover rounded"
          />
        </div>
      </div>

      {/* Cards Section */}
      <div className="flex flex-col md:flex-row justify-center items-start md:items-center gap-8 md:gap-12 py-16">
        {data.map((item, index) => (
          <div key={index} className="w-full md:w-1/3 text-center">
            <h2 className="text-2xl md:text-3xl font-medium mb-4 text-[#333333]">
              {item.title}
            </h2>
            <h4 className="text-[#333333] text-base md:text-lg px-2">
              {item.subtitle}
            </h4>
          </div>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="w-full flex flex-col-reverse md:flex-row justify-between items-center md:space-x-12 space-y-8 md:space-y-0">
        <div className="w-full md:w-1/2">
          <img
            src={about2}
            alt="about"
            className="w-full h-auto object-cover rounded"
          />
        </div>
        <div className="w-full md:w-1/2">
          <h1 className="font-semibold text-2xl text-[#492F92] md:text-[40px]">
            Your Journey to Reliable Car Care
          </h1>
          <p className="md:text-lg text-base text-[#333333] mt-6">
            At Gapa, we make car care simple and stress-free. Whether it's
            routine maintenance, emergency repairs, or service bookings, our
            platform connects drivers with trusted auto experts — fast,
            reliable, and right when you need it.
          </p>
        </div>
      </div>
      {/* Logo Carousel Container */}
      <div className="relative overflow-hidden my-20">
        {/* Gradient overlays for smooth fade effect */}
        <div className="absolute left-0 top-0 w-16 md:w-24 lg:w-32 h-full bg-gradient-to-r from-gray-50 to-transparent z-10"></div>
        <div className="absolute right-0 top-0 w-16 md:w-24 lg:w-32 h-full bg-gradient-to-l from-gray-50 to-transparent z-10"></div>

        {/* Scrolling Logos */}
        <div className="flex animate-scroll hover:pause-animation">
          {duplicatedBrands.map((brand, index) => (
            <div
              key={`${brand.id}-${index}`}
              className="flex-shrink-0 mx-4 md:mx-6 lg:mx-8 flex items-center justify-center group"
            >
              <div className="w-fit h-20  md:h-24  lg:h-28  rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center p-1 group-hover:scale-110 transform">
                <img
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  className="max-w-full max-h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          animation: scroll 15s linear infinite;
        }

        .pause-animation:hover {
          animation-play-state: paused;
        }

        @media (max-width: 768px) {
          .animate-scroll {
            animation: scroll 12s linear infinite;
          }
        }

        @media (max-width: 480px) {
          .animate-scroll {
            animation: scroll 6s linear infinite;
          }
        }
      `}</style>
    </div>
  );
};

export default About;
