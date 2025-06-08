import React from "react";
import brand from "../assets/brand.png";
import brand1 from "../assets/brand1.png";
import brand2 from "../assets/brand2.png";
import brand3 from "../assets/brand3.png";
import brand4 from "../assets/brand4.png";

const BrandSection = () => {
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
    <section className="py-12 md:py-16 lg:py-20 bg-[#f3f1f7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-[#333333] mb-4">
            Expert Repairs for the Brands You Drive
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl font-medium mx-auto">
            Our certified technicians are trained to handle vehicles from the
            world’s most trusted car manufacturers.
          </p>
        </div>

        {/* Logo Carousel Container */}
        <div className="relative overflow-hidden">
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
    </section>
  );
};

export default BrandSection;
