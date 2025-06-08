import React, { useRef, useEffect, useState } from "react";
import service1 from "../assets/service1.png";
import service2 from "../assets/service2.png";
import service3 from "../assets/service3.png";
import {
  ChevronLeft,
  ChevronRight,
  Droplets,
  CircleDashed,
  Disc,
  Cpu,
  BatteryCharging,
  Gauge,
} from "lucide-react";

const Service = () => {
  const sliderRef = useRef(null);
  const [cardsPerView, setCardsPerView] = useState(1);
  const [currentSlide, setCurrentSlide] = useState(0);

  const services = [
    {
      id: 1,
      title: "Oil Change",
      description:
        "Quick and professional oil change service to keep your engine running smoothly",
      icon: Droplets,
      bgColor: "bg-[#F7CD3A]",
      image: service1,
      text: "text-black",
    },
    {
      id: 2,
      title: "Brake Repair",
      description:
        "Expert brake inspection and repair services for your safety on the road",
      icon: Disc,
      bgColor: "bg-[#492F92]",
      image: service2,
      text: "text-white",
    },
    {
      id: 3,
      title: "Tire Service",
      description:
        "Complete tire installation, rotation, and balancing services",
      icon: CircleDashed,
      bgColor: "bg-[#F7CD3A]",
      image: service3,
      text: "text-black",
    },
    {
      id: 4,
      title: "Engine Diagnostics",
      description:
        "Advanced diagnostic services to identify and resolve engine issues",
      icon: Cpu,
      bgColor: "bg-[#492F92]",
      image: service1,
      text: "text-white",
    },
    {
      id: 5,
      title: "Battery Service",
      description:
        "Battery testing and maintenance for reliable vehicle operation",
      icon: BatteryCharging,
      bgColor: "bg-[#F7CD3A]",
      image: service2,
      text: "text-black",
    },
    {
      id: 6,
      title: "Performance Tuning",
      description:
        "Optimize your vehicle's performance with our professional tuning services",
      icon: Gauge,
      bgColor: "bg-[#492F92]",
      image: service3,
      text: "text-white",
    },
  ];

  const updateCardsPerView = () => {
    const width = window.innerWidth;
    if (width >= 1024) return 3;
    if (width >= 640) return 2;
    return 1;
  };

  const updateSliderPosition = () => {
    const slider = sliderRef.current;
    if (!slider) return;

    const slideWidth =
      slider.children[0].offsetWidth +
      parseFloat(getComputedStyle(slider.children[0]).marginRight || 0);

    slider.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
  };

  useEffect(() => {
    const handleResize = () => {
      const newCardsPerView = updateCardsPerView();
      setCardsPerView(newCardsPerView);
    };

    handleResize(); // Initial setup
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      updateSliderPosition();
    });

    const observerTarget = sliderRef.current;
    if (observerTarget) {
      resizeObserver.observe(observerTarget);
    }

    return () => {
      if (observerTarget) {
        resizeObserver.unobserve(observerTarget);
      }
    };
  }, [cardsPerView, currentSlide]);

  const slideNext = () => {
    const maxSlide = services.length - cardsPerView;
    setCurrentSlide((prev) => (prev >= maxSlide ? 0 : prev + 1));
  };

  const slidePrev = () => {
    const maxSlide = services.length - cardsPerView;
    setCurrentSlide((prev) => (prev <= 0 ? maxSlide : prev - 1));
  };

  const ServiceCard = ({ service }) => (
    <div className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 px-2 max-w-full">
      <div className="rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
        <div className="relative h-48 md:h-56 overflow-hidden">
          <img
            src={service.image}
            alt={service.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          />
          <div className="absolute top-4 left-4 backdrop-blur-sm">
            <service.icon className="w-8 h-8 text-[#E5E5E5]" />
          </div>
        </div>
        <div className={`${service.bgColor} p-6 ${service.text} text-start`}>
          <h3 className="text-xl md:text-2xl font-bold mb-3">
            {service.title}
          </h3>
          <p className="text-sm md:text-base opacity-90 leading-relaxed">
            {service.description}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <section className="py-8 md:py-12 lg:py-16 lg:px-20 md:px-16 sm:px-12 px-8 ">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row w-full mb-8 md:mb-12 justify-between items-start sm:items-center gap-4">
          <h1 className="text-[#333333] font-semibold text-2xl md:text-4xl leading-tight">
            Our Expert Services
          </h1>
          <button className="bg-[#492F92] text-white shadow-md font-medium py-3 md:py-4 px-4 md:px-6 rounded-lg hover:bg-[#3b2371] transition duration-300 cursor-pointer text-sm md:text-base whitespace-nowrap">
            View All Services
          </button>
        </div>

        {/* Slider */}
        <div className="relative">
          <div className="overflow-hidden">
            <div
              ref={sliderRef}
              className="flex transition-transform duration-500 ease-in-out"
            >
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </div>

          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={slidePrev}
              className="p-3 rounded-full bg-[#492F92] text-white hover:bg-[#3b2371] transition-all duration-300 transform hover:scale-105"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={slideNext}
              className="p-3 rounded-full bg-[#492F92] text-white hover:bg-[#3b2371] transition-all duration-300 transform hover:scale-105"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Service;
