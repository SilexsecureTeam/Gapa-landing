import React from "react";
import service from "../assets/repair.png";
import serve from "../assets/oil.png";
import serve1 from "../assets/serve1.png";
import serve2 from "../assets/service1.png";
import serve3 from "../assets/check.png";
import serve4 from "../assets/wheel.png";
import serve5 from "../assets/suspension.png";
import { Link } from "react-router-dom";

const Serve = () => {
  const services = [
    {
      image: serve,
      title: "Oil Service",
      text: "Premium oil changes for engine longevity using genuine auto spare parts.",
    },
    {
      image: serve1,
      title: "Brake System Service",
      text: "Safe, responsive braking solutions with expert inspections and repairs.",
    },
    {
      image: serve2,
      title: "Diagnostic Services",
      text: "Advanced tools for accurate issue detection and thorough vehicle analysis.",
    },
    {
      image: serve3,
      title: "Engine Check",
      text: "Thorough inspections to maintain performance and optimize your engine.",
    },
    {
      image: serve4,
      title: "Wheel Balancing & Alignment",
      text: "Precision services for smooth, safe rides with enhanced vehicle control.",
    },
    {
      image: serve5,
      title: "Suspension Systems",
      text: "Enhanced comfort and control with professional suspension maintenance.",
    },
  ];

  const additionalServices = [
    {
      title: "Tyre Change",
      text: "Quality tires with expert installation for optimal road performance.",
    },
    {
      title: "Car Detailing",
      text: "Restore your vehicle's shine inside and out with professional detailing.",
    },
    {
      title: "Comprehensive Repairs",
      text: "Complete fixes for all makes and models using genuine spare parts.",
    },
    {
      title: "Paint & Bodywork",
      text: "From scratch removal to full resprays, we restore your car's shine and factory finish. Our team handles dents, scuffs, and faded paint with precision, using high-quality paints that last. Drive out looking brand new.",
    },
  ];

  return (
    <div className="bg-[#f3f1f7] py-8 md:py-12 lg:py-16 px-4 sm:px-8 md:px-16 lg:px-20">
      {/* Top Section */}
      <div className="w-full flex flex-col md:flex-row justify-between items-center md:space-x-12 space-y-8 md:space-y-0">
        <div className="w-full md:w-1/2">
          <h1 className="font-semibold text-2xl text-[#333333] md:text-[40px] leading-tight">
            Expert Car Repair & <br />
            Maintenance Services
          </h1>
          <p className="md:text-lg text-base text-[#333333] mt-6">
            GAPA Fix offers a full suite of auto repair and maintenance
            services, using genuine auto spare parts sourced through our
            advanced part-matching technology. Our Lagos-based team ensures your
            vehicle performs at its peak, with services tailored to your needs.
          </p>
          <Link to="/">
            <button className="bg-[#492F92] text-center font-semibold text-xl w-[60%] py-4 text-white my-8 rounded cursor-pointer hover:bg-[#3d2578] transition-colors duration-300">
              Book Now
            </button>{" "}
          </Link>
        </div>
        <div className="w-full md:w-1/2">
          <img
            src={service}
            alt="Expert car repair and maintenance services"
            className="w-full h-auto object-cover rounded"
          />
        </div>
      </div>

      {/* Main Services Grid */}
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
                className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="px-5">
              <h3 className="text-xl font-semibold text-[#333333] mt-3">
                {service.title}
              </h3>
              <p className="text-[#333333] text-base mt-1 leading-relaxed">
                {service.text}
              </p>
              <Link to="/">
                {" "}
                <button className="bg-[#F7CD3A] px-3 py-2 font-medium cursor-pointer text-black text-sm my-3">
                  Book Now
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Services Section */}
      <div className="mt-16 pt-8 border-t border-gray-300">
        <h2 className="text-2xl md:text-3xl font-semibold text-[#333333] text-center mb-12">
          Additional Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {additionalServices.map((service, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <h3 className="text-xl font-semibold text-[#333333] mb-3">
                {service.title}
              </h3>
              <p className="text-[#333333] text-base leading-relaxed">
                {service.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="mt-16 bg-white p-8 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl md:text-3xl font-semibold text-[#333333] mb-4">
          Get Started Today
        </h2>
        <p className="text-lg text-[#333333] mb-6">
          Schedule your service or request a free quote today! Our expert team
          is ready to help keep your vehicle running smoothly.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/service">
            <button className="bg-[#492F92] text-white font-semibold text-lg px-8 py-3 rounded hover:bg-[#3d2578] transition-colors duration-300">
              Schedule Service
            </button>{" "}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Serve;
