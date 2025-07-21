import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import serve from "../assets/serve6.png";

import avatar from "../assets/avatar.png";
import ava1 from "../assets/ava1.png";
import ava2 from "../assets/ava2.png";
import ava3 from "../assets/ava3.png";
import ava4 from "../assets/ava4.png";
import ava5 from "../assets/ava5.png";

const AutomotiveTestimonials = () => {
  const reviews = [
    {
      id: 1,
      rating: 5,
      carModel: "Toyota Camry 2022",
      review:
        "Working with DigitX was a pleasure. Their web design team created a stunning website that perfectly captured our brand's essence. The feedback from our customers has been overwhelmingly positive.",
      customerName: "Jessica Thomas",
      occupation: "Financial Analyst",
      avatar: ava1,
    },
    {
      id: 2,
      rating: 5,
      carModel: "Honda Civic 2021",
      review:
        "Outstanding brake repair service. They diagnosed the issue quickly and fixed it at a fair price. The staff was knowledgeable and kept me informed throughout the process.",
      customerName: "Michael Chen",
      occupation: "Software Engineer",
      avatar: ava2,
    },
    {
      id: 3,
      rating: 5,
      carModel: "BMW 3 Series 2020",
      review:
        "Top-notch engine diagnostics and repair. They found and fixed issues that other shops missed. Professional service with attention to detail. Will definitely return.",
      customerName: "Sofia Rodriguez",
      occupation: "Business Owner",
      avatar: ava3,
    },
    {
      id: 4,
      rating: 5,
      carModel: "Ford F-150 2023",
      review:
        "Great tire service and installation. Quick turnaround time and competitive pricing. The team explained everything clearly and provided excellent customer support.",
      customerName: "David Thompson",
      occupation: "Construction Manager",
      avatar: ava4,
    },
    {
      id: 5,
      rating: 5,
      carModel: "Mercedes C-Class 2022",
      review:
        "Exceptional battery replacement service. They tested my electrical system thoroughly and installed a high-quality battery. Professional and reliable service.",
      customerName: "Lisa Martinez",
      occupation: "Doctor",
      avatar: ava5,
    },
    {
      id: 6,
      rating: 5,
      carModel: "Audi A4 2021",
      review:
        "Impressive performance tuning service. My car's performance improved significantly. The technicians are skilled and use quality parts. Highly satisfied with the results.",
      customerName: "James Wilson",
      occupation: "Financial Advisor",
      avatar: avatar,
    },
  ];

  const images = [serve];

  const Counter = ({ end, label }) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
      let start = 0;
      const duration = 2000;
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

  const Testimonial = ({ review, customerName, occupation, avatar }) => {
    return (
      <div className="bg-purple-800 text-white p-6 rounded-lg shadow-md w-1/2 relative">
        <div className="absolute top-2 left-2 text-7xl font-serif italic">
          "
        </div>
        <p className="italic pt-12 pb-8 text-base pl-2">"{review}"</p>
        <div className="flex items-start mt-4">
          <img
            src={avatar}
            alt={customerName}
            className="w-12 h-12 rounded-full mr-4"
          />
          <div>
            <p className="text-xs font-semibold">{customerName}</p>
            <p className="text-xs text-gray-300">{occupation}</p>
          </div>
        </div>
      </div>
    );
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerView = 2;
  const totalSlides = Math.ceil(reviews.length / itemsPerView);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const visibleTestimonials = reviews.slice(
    currentIndex * itemsPerView,
    (currentIndex + 1) * itemsPerView
  );

  return (
    <div className="py-6 lg:px-20 md:px-16 sm:px-12 px-4">
      <div className="w-full">
        <div className="flex justify-around mb-6">
          <Counter end={10} label="Happy Customers" />
          <Counter end={50} label="Mechanics on Staff" />
          <Counter end={24} label="Average Turnaround Time" />
          <Counter end={15} label="Years in Business" />
        </div>

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
                <ChevronLeft size={25} />
              </button>
              <button
                onClick={nextSlide}
                className="bg-[#D5AB16] p-1 rounded-full shadow-md transition"
              >
                <ChevronRight size={25} />
              </button>
            </div>
          </div>

          <div className="md:w-1/2 w-full md:pt-35 relative">
            <h2 className="text-xl md:text-4xl md:pl-20 font-semibold text-[#414245] mb-4">
              What Our Customers Say About Us
            </h2>
            <div className="flex px-4 space-x-4 overflow-hidden">
              {visibleTestimonials.map((testimonial) => (
                <Testimonial
                  key={testimonial.id}
                  review={testimonial.review}
                  customerName={testimonial.customerName}
                  occupation={testimonial.occupation}
                  avatar={testimonial.avatar}
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
