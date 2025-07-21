import React from "react";
import about from "../assets/about1.png";
import about2 from "../assets/about2.png";
import brand from "../assets/brand.png";
import brand1 from "../assets/brand1.png";
import brand2 from "../assets/brand2.png";
import brand3 from "../assets/brand3.png";
import brand4 from "../assets/brand4.png";
import { Link } from "react-router-dom";

const About = () => {
  const data = [
    {
      title: "Our Mission",
      subtitle:
        "To empower Nigerian car owners with reliable, transparent car repairs using genuine spare parts, restoring trust in every journey.",
    },
    {
      title: "Our Vision",
      subtitle:
        "To lead automotive care in Nigeria by blending innovative technology with exceptional service, ensuring every vehicle runs at its best.",
    },
    {
      title: "Our Values",
      subtitle:
        "Integrity: Honest service with no compromises on quality. Reliability: Dependable repairs that last. Care: Putting your safety and satisfaction first.",
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
          <h1 className="max-w-[450px] font-semibold text-2xl text-[#333333] md:text-text-3xl">
            About GAPA Fix: Redefining Auto Care in Nigeria
          </h1>
          <p className="md:text-lg text-base text-[#333333] mt-6">
            GAPA Fix is your premier destination for car repairs and genuine
            auto spare parts in Lagos. We combine advanced technology with
            skilled craftsmanship to deliver flawless vehicle maintenance. Our
            proprietary part-matching system ensures every repair uses authentic
            spare parts, sourced from OEM-trusted brands, giving you confidence
            in your car's performance.
          </p>
          <p className="md:text-lg text-base text-[#333333] mt-4">
            With a passion for excellence, we're here to make every drive safe
            and worry-free.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link to="/service">
              <button className="bg-[#492F92] text-center font-semibold text-lg px-8 py-4 text-white rounded cursor-pointer hover:bg-[#3d2578] transition-colors">
                Discover Our Services
              </button>{" "}
            </Link>
            <Link to="/contact">
              <button className="border-2 border-[#492F92] text-center font-semibold text-lg px-8 py-4 text-[#492F92] rounded cursor-pointer hover:bg-[#492F92] hover:text-white transition-colors">
                Contact Us
              </button>
            </Link>
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <img
            src={about}
            alt="GAPA Fix auto repair services in Lagos"
            className="w-full h-auto object-cover rounded"
          />
        </div>
      </div>

      {/* Cards Section */}
      <div className="flex flex-col md:flex-row justify-center items-start md:items-center gap-8 md:gap-12 py-16 md:py-20">
        {data.map((item, index) => (
          <div
            key={index}
            className="w-full md:w-1/3 md:h-56 bg-white shadow-lg cursor-pointer duration-300 hover:scale-105 hover:shadow-xl p-6 rounded-lg text-start"
          >
            <h2 className="text-xl font-semibold mb-4 text-[#492F92]">
              {item.title}
            </h2>
            <p className="text-[#333333] text-base leading-relaxed">
              {item.subtitle}
            </p>
          </div>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="w-full flex flex-col-reverse md:flex-row justify-between items-start md:space-x-12 space-y-8 md:space-y-0">
        <div className="w-full md:w-1/2">
          <img
            src={about2}
            alt="Professional auto repair technicians at GAPA Fix"
            className="w-full h-80 md:h-100 object-cover rounded"
          />
        </div>
        <div className="w-full md:w-1/2">
          <h1 className="font-semibold text-2xl text-[#492F92] md:text-3xl">
            Your Journey to Reliable Car Care
          </h1>
          <p className="md:text-lg text-base text-[#333333] mt-6">
            At GAPA Fix, we understand that your car is more than just a
            vehicle—it's your freedom, your reliability, your peace of mind.
            That's why we've revolutionized auto care in Lagos with our advanced
            technology and skilled craftsmanship.
          </p>
          <p className="md:text-lg text-base text-[#333333] mt-4">
            Our proprietary part-matching system and OEM-trusted brands ensure
            every repair meets the highest standards, making every drive safe
            and worry-free.
          </p>
          <div className="mt-6">
            <p className="text-sm text-[#666666] italic">
              Trusted mechanic Lagos • Genuine auto spare parts near me • Auto
              repair shop Lagos
            </p>
          </div>
        </div>
      </div>

      {/* Logo Carousel Container */}
      <div className="relative overflow-hidden my-20">
        <h3 className="text-center text-2xl font-semibold text-[#333333] mb-8">
          Trusted by Leading Automotive Brands
        </h3>

        {/* Gradient overlays for smooth fade effect */}
        <div className="absolute left-0 top-0 w-16 md:w-24 lg:w-32 h-full bg-gradient-to-r from-[#f3f1f7] to-transparent z-10"></div>
        <div className="absolute right-0 top-0 w-16 md:w-24 lg:w-32 h-full bg-gradient-to-l from-[#f3f1f7] to-transparent z-10"></div>

        {/* Scrolling Logos */}
        <div className="flex animate-scroll hover:pause-animation">
          {duplicatedBrands.map((brand, index) => (
            <div
              key={`${brand.id}-${index}`}
              className="flex-shrink-0 mx-4 md:mx-6 lg:mx-8 flex items-center justify-center group"
            >
              <div className="w-fit h-20 md:h-24 lg:h-28 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center p-4 group-hover:scale-110 transform bg-white">
                <img
                  src={brand.logo}
                  alt={`${brand.name} genuine auto parts`}
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
          animation: scroll 20s linear infinite;
        }

        .pause-animation:hover {
          animation-play-state: paused;
        }

        @media (max-width: 768px) {
          .animate-scroll {
            animation: scroll 15s linear infinite;
          }
        }

        @media (max-width: 480px) {
          .animate-scroll {
            animation: scroll 10s linear infinite;
          }
        }
      `}</style>
    </div>
  );
};

export default About;
