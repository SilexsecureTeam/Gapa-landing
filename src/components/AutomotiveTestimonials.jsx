import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import serve from "../assets/serve6.png";
import avatar from "../assets/avatar.png";

const AutomotiveTestimonials = () => {
  const testimonials = [
    {
      quote:
        "From start to finish, the team truly understood our vision. The result was a stylish, functional, and uniquely ours car.",
      author: "Nathan Adedayo, Abuja, Nigeria",
    },
    {
      quote:
        "Working with them was a dream. They transformed our space into something even better than we imagined.",
      author: "Olivia Adedayo, Abuja, Nigeria",
    },
    {
      quote:
        "The team’s expertise exceeded our expectations, delivering a car that perfectly matches our style and needs.",
      author: "Emeka Okonkwo, Lagos, Nigeria",
    },
    {
      quote:
        "Their dedication turned our ideas into reality, creating a vehicle beyond what we could have hoped for.",
      author: "Aisha Mohammed, Kano, Nigeria",
    },
    {
      quote:
        "With their skill, they crafted a car that reflects our vision with outstanding quality and care.",
      author: "Chukwuma Eze, Port Harcourt, Nigeria",
    },
  ];

  const images = [serve];

  // Counter Logic
  const Counter = ({ end, label }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      let start = 0;
      const duration = 2000; // Animation duration in ms
      const stepTime = Math.abs(Math.floor(duration / end));
      const timer = setInterval(() => {
        start += 1;
        if (start <= end) {
          setCount(start);
        } else {
          clearInterval(timer);
        }
      }, stepTime);

      return () => clearInterval(timer);
    }, [end]);

    return (
      <div className="text-center">
        <h3 className="text-2xl md:text-4xl font-normal text-[#D5AB16]">
          {count}+
        </h3>
        <p className="text-sm md:text-lg">{label}</p>
      </div>
    );
  };

  // Testimonial Logic
  const Testimonial = ({ quote, author }) => {
    const [name, location] = author.split(", ");

    return (
      <div className="bg-purple-800 text-white p-6 rounded-lg shadow-md w-1/2 relative ">
        <div className="absolute top-2 left-2 text-7xl font-serif italic ">
          "
        </div>
        <p className="italic pt-12 pb-18 text-base pl-2">"{quote}"</p>
        <div className="flex items-start">
          <img
            src={avatar}
            alt="Avatar"
            className="w-12 h-12 rounded-full mr-4"
          />

          <div className="flex justify-end">
            <div className="text-right">
              <p className="text-xs font-semibold">{name}</p>
              <p className="text-xs text-gray-300">{location}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Testimonial Slider Logic
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerView = 2;
  const totalSlides = Math.ceil(testimonials.length / itemsPerView);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const visibleTestimonials = testimonials.slice(
    currentIndex * itemsPerView,
    (currentIndex + 1) * itemsPerView
  );

  // Slider Logic with absolute positioning
  return (
    <div className="py-6 lg:px-20 md:px-16 sm:px-12 px-4">
      <div className="w-full ">
        <div className="grid grid-cols-1 w-full pb-10 gap-6">
          {/* Stats Section */}
          <div className="flex justify-around mb-6">
            <Counter end={10} label="Happy Customers" />
            <Counter end={50} label="Mechanics on Staff" />
            <Counter end={24} label="Average Turnaround Time" />
            <Counter end={15} label="Years in Business" />
          </div>
        </div>

        {/* Testimonial and Slider Section */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/2 h-120 hidden md:block relative">
            <div
              className="absolute top-0 left-0 w-full h-full"
              style={{ zIndex: 0 }}
            >
              <img
                src={images[0]}
                alt="Car"
                className="w-full h-110 object-cover md:block hidden transition-opacity duration-500"
              />
            </div>
            <div
              className="absolute bottom-0 -left-40 w-full flex justify-center mt-2 md:mt-4"
              style={{ zIndex: 1 }}
            >
              <button
                onClick={prevSlide}
                className="bg-[#D5AB16] p-1 rounded-full shadow-md transition mr-2"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={nextSlide}
                className="bg-[#D5AB16] p-1 rounded-full shadow-md transition"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="md:w-1/2 w-full md:pt-35 relative">
            <h2 className="text-xl md:text-4xl md:pl-20 font-semibold text-[#414245] mb-4">
              What Our Customers Say About Us
            </h2>
            <div className="flex px-4 space-x-4 overflow-hidden">
              {visibleTestimonials.map((testimonial, index) => (
                <Testimonial
                  key={index}
                  quote={testimonial.quote}
                  author={testimonial.author}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutomotiveTestimonials;
