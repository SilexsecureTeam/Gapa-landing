import React from "react";
import heroBg from "../assets/hero-bg.png";
import hero1 from "../assets/hero1.png";
import hero2 from "../assets/hero2.png";
import hero3 from "../assets/hero3.png";

const Hero = () => {
  return (
    <section
      className="relative h-fit md:h-[90vh] py-12 md:py-10 lg:px-20 md:px-16 sm:px-12 px-8 bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      {/* Content */}
      <div className="flex flex-col md:flex-row z-10 justify-between items-center w-full relative">
        {/* Left Side (Text) */}
        <div className="w-full md:w-2/3 text-white px-0 animate-fadeIn order-1 md:order-1 mt-8 md:mt-0">
          <h1 className="text-2xl sm:text-3xl md:text-5xl poppins uppercase leading-tight md:leading-[3.5rem] md:text-start text-center font-semibold mb-4 sm:mb-6">
            <span className="text-[#F7CD3A]">Fast</span>, Reliable Auto Repairs
            <br className="hidden sm:block" />
            at Your Fingertips
          </h1>
          <div className="mx-auto md:mx-0 w-16 h-1 bg-[#F7CD3A] mb-4"></div>
          <p className="text-base sm:text-lg md:text-xl w-full md:w-3/4 font-light text-[#E5E5E5] mt-4 md:mt-6 text-center md:text-left">
            Book expert car services in minutes, track repairs in real-time, and
            get back on the road faster — all from your phone.
          </p>
        </div>

        {/* Right Side (Images & CTA) */}
        <div className="w-full md:w-1/3 mt-15 md:mt-0 text-white px-0 sm:px-2 md:px-4 animate-fadeIn flex justify-start flex-col order-2 md:order-2">
          <div className="mb-4 flex justify-center md:justify-start gap-2">
            <img
              src={hero1}
              alt="hero1"
              className="w-12 h-12 sm:w-15 sm:h-15 object-cover rounded-lg shadow-md"
            />
            <img
              src={hero2}
              alt="hero2"
              className="w-12 h-12 sm:w-15 sm:h-15 object-cover rounded-lg shadow-md"
            />
            <img
              src={hero3}
              alt="hero3"
              className="w-12 h-12 sm:w-15 sm:h-15 object-cover rounded-lg shadow-md"
            />
          </div>
          <p className="text-base sm:text-lg md:text-xl w-full font-light text-[#E5E5E5] mt-2 ">
            Join 10,000+ Car Owners Who Trust Our Service
          </p>
          <button className="bg-[#492F92] mt-6 text-white py-3 px-6 w-full sm:w-auto rounded hover:bg-[#3b2371] transition duration-300 text-base font-medium shadow-md">
            Book an Appointment
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
