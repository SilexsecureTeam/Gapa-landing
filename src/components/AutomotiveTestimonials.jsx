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
        "Exceptional battery replacement service. They tested my entire electrical system before installing a high-quality battery. The team was prompt, professional, and very transparent. I highly recommend GAPA Fix",
      customerName: "Tope A",
      occupation: "Ikoyi",
      avatar: ava1,
    },
    {
      id: 2,
      rating: 5,
      carModel: "BMW 3 Series 2020",
      review:
        "GAPA Fix came to my office in Surulere to work on my brakes. They diagnosed the problem, sourced the parts, and fixed it same day. No stress, no back and forth. Honest pricing too!",
      customerName: "David K",
      occupation: "Surulere",
      avatar: ava2,
    },
    {
      id: 3,
      rating: 5,
      carModel: "Honda Civic 2021",
      review:
        "These guys know what they’re doing. They handled my Range Rover’s overheating issue with speed and precision. Their customer service was top-tier and the follow-up call the next day really impressed me",
      customerName: "Chioma E",
      occupation: "Lekki",
      avatar: ava3,
    },
    {
      id: 4,
      rating: 5,
      carModel: "Ford F-150 2023",
      review:
        "My car wouldn’t start, and they pulled up within the hour. The mechanic explained every step, fixed the ignition fault, and even gave tips to avoid future issues. Reliable and professional—10/10",
      customerName: "Blessing M.",
      occupation: "Ajah",
      avatar: ava4,
    },
    {
      id: 5,
      rating: 5,
      carModel: "Mercedes-Benz C-Class 2019",
      review:
        "GAPA Fix saved me when my car’s AC stopped working in the middle of Lagos traffic. They arrived quickly, diagnosed the issue, and had it fixed in no time. Super professional and great value for money!",
      customerName: "Ahmed T",
      occupation: "Victoria Island",
      avatar: ava5,
    },
    {
      id: 6,
      rating: 5,
      carModel: "Nissan Altima 2020",
      review:
        "I had a tire blowout on the highway, and GAPA Fix was there in under 30 minutes. They replaced the tire and checked the others for safety. Their service is fast, friendly, and trustworthy!",
      customerName: "Funmi O",
      occupation: "Ikeja",
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
      <div className="bg-purple-800 text-white p-6 rounded-lg shadow-md w-full relative">
        <div className="absolute top-2 left-2 text-7xl font-serif italic">"</div>
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
  const [itemsPerView, setItemsPerView] = useState(
    window.innerWidth < 768 ? 1 : 2
  );

  useEffect(() => {
    const handleResize = () => {
      setItemsPerView(window.innerWidth < 768 ? 1 : 2);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
        <div className="flex justify-around mb-6 flex-wrap gap-y-4">
          <Counter end={10} label="Happy Customers" />
          <Counter end={50} label="Mechanics on Staff" />
          <Counter end={24} label="Average Turnaround Time" />
          <Counter end={15} label="Years in Business" />
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/2 h-120 hidden md:block relative">
            <img
              src={images[0]}
              alt="Car"
              className="w-full h-110 object-cover rounded-md transition-opacity duration-500"
            />
            <div className="absolute bottom-0 -left-40 w-full flex justify-center mt-2 md:mt-4">
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

          <div className="md:w-1/2 w-full relative">
            <h2 className="text-xl md:text-4xl md:pl-20 font-semibold text-[#414245] mb-4">
              What Our Customers Say About Us
            </h2>
            <div className="flex items-center justify-between md:justify-start md:pl-20 mb-4 md:hidden">
              <button
                onClick={prevSlide}
                className="bg-[#D5AB16] p-2 rounded-full shadow-md mr-2"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={nextSlide}
                className="bg-[#D5AB16] p-2 rounded-full shadow-md"
              >
                <ChevronRight size={20} />
              </button>
            </div>
            <div className="flex px-4 space-x-4 overflow-hidden transition-all duration-300">
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
