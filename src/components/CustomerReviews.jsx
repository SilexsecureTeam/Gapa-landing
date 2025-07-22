import React, { useRef } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import avatar from "../assets/avatar.png";
import ava1 from "../assets/ava1.png";
import ava2 from "../assets/ava2.png";
import ava3 from "../assets/ava3.png";
import ava4 from "../assets/ava4.png";
import ava5 from "../assets/ava5.png";

const CustomerReviews = () => {
  const desktopSliderRef = useRef(null);
  const mobileSliderRef = useRef(null);
  const desktopCurrentSlide = useRef(0);
  const mobileCurrentSlide = useRef(0);

  const reviews = [
  {
    id: 1,
    rating: 5,
    carModel: "Toyota Camry 2022",
    review: "Exceptional battery replacement service. They tested my entire electrical system before installing a high-quality battery. The team was prompt, professional, and very transparent. I highly recommend GAPA Fix",
    customerName: "Tope A",
    occupation: "Ikoyi",
    avatar: ava1
  },
  {
    id: 2,
    rating: 5,
    carModel: "BMW 3 Series 2020",
    review: "GAPA Fix came to my office in Surulere to work on my brakes. They diagnosed the problem, sourced the parts, and fixed it same day. No stress, no back and forth. Honest pricing too!",
    customerName: "David K",
    occupation: "Surulere",
    avatar: ava2
  },
  {
    id: 3,
    rating: 5,
    carModel: "Honda Civic 2021",
    review: "These guys know what they’re doing. They handled my Range Rover’s overheating issue with speed and precision. Their customer service was top-tier and the follow-up call the next day really impressed me",
    customerName: "Chioma E",
    occupation: "Lekki",
    avatar: ava3
  },
  {
    id: 4,
    rating: 5,
    carModel: "Ford F-150 2023",
    review: "My car wouldn’t start, and they pulled up within the hour. The mechanic explained every step, fixed the ignition fault, and even gave tips to avoid future issues. Reliable and professional—10/10",
    customerName: "Blessing M.",
    occupation: "Ajah",
    avatar: ava4
  },
  {
    id: 5,
    rating: 5,
    carModel: "Mercedes-Benz C-Class 2019",
    review: "GAPA Fix saved me when my car’s AC stopped working in the middle of Lagos traffic. They arrived quickly, diagnosed the issue, and had it fixed in no time. Super professional and great value for money!",
    customerName: "Ahmed T",
    occupation: "Victoria Island",
    avatar: ava5
  },
  {
    id: 6,
    rating: 5,
    carModel: "Nissan Altima 2020",
    review: "I had a tire blowout on the highway, and GAPA Fix was there in under 30 minutes. They replaced the tire and checked the others for safety. Their service is fast, friendly, and trustworthy!",
    customerName: "Funmi O",
    occupation: "Ikeja",
    avatar: avatar
  }
];

  // Desktop/Tablet slider functions (2 cards)
  const desktopSlideNext = () => {
    const maxSlide = Math.max(0, Math.ceil(reviews.length / 2) - 1);
    if (desktopCurrentSlide.current < maxSlide) {
      desktopCurrentSlide.current += 1;
    } else {
      desktopCurrentSlide.current = 0;
    }
    updateDesktopSliderPosition();
  };

  const desktopSlidePrev = () => {
    const maxSlide = Math.max(0, Math.ceil(reviews.length / 2) - 1);
    if (desktopCurrentSlide.current > 0) {
      desktopCurrentSlide.current -= 1;
    } else {
      desktopCurrentSlide.current = maxSlide;
    }
    updateDesktopSliderPosition();
  };

  const updateDesktopSliderPosition = () => {
    if (desktopSliderRef.current) {
      const translateX = desktopCurrentSlide.current * 100;
      desktopSliderRef.current.style.transform = `translateX(-${translateX}%)`;
    }
  };

  // Mobile slider functions (1 card)
  const mobileSlideNext = () => {
    if (mobileCurrentSlide.current < reviews.length - 1) {
      mobileCurrentSlide.current += 1;
    } else {
      mobileCurrentSlide.current = 0;
    }
    updateMobileSliderPosition();
  };

  const mobileSlidePrev = () => {
    if (mobileCurrentSlide.current > 0) {
      mobileCurrentSlide.current -= 1;
    } else {
      mobileCurrentSlide.current = reviews.length - 1;
    }
    updateMobileSliderPosition();
  };

  const updateMobileSliderPosition = () => {
    if (mobileSliderRef.current) {
      const slideWidth = mobileSliderRef.current.children[0].offsetWidth + 24;
      mobileSliderRef.current.style.transform = `translateX(-${
        mobileCurrentSlide.current * slideWidth
      }px)`;
    }
  };

  const StarRating = ({ rating }) => (
    <div className="flex items-center gap-1 mb-4">
      {[...Array(5)].map((_, index) => (
        <Star
          key={index}
          className={`w-5 h-5 ${
            index < rating ? "text-yellow-400 fill-current" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );

  const ReviewCard = ({ review }) => (
    <div className=" rounded-xl shadow-xl p-6 md:p-8 h-full flex flex-col hover:shadow-xl transition-shadow duration-300">
      <StarRating rating={review.rating} />

      <div className="mb-4 ">
        <p className="text-sm md:text-base text-gray-600 font-semibold">
          Car model: <span className="font-medium">{review.carModel}</span>
        </p>
      </div>

      <div className="flex-grow mb-6">
        <p className="text-gray-700 max-w-[400px] text-sm md:text-base leading-relaxed">
          "{review.review}"
        </p>
      </div>

      <div className="flex items-center gap-4">
        <img
          src={review.avatar}
          alt={review.customerName}
          className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover"
        />
        <div>
          <h4 className="font-medium text-gray-900 text-sm md:text-base">
            {review.customerName}
          </h4>
          <p className="text-gray-600 font-light text-xs md:text-sm">
            {review.occupation}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <section className="py-8 md:py-12 lg:py-16 lg:px-20 md:px-16 sm:px-12 px-4 ">
      <div className="">
        {/* Header with Title and Navigation */}
        <div className="flex justify-between items-start md:items-center mb-8 md:mb-12">
          <div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#333333] mb-2">
              Customer Reviews
            </h2>
          </div>

          {/* Navigation Arrows - Desktop/Tablet */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={desktopSlidePrev}
              className="p-3 rounded-full bg-[#492F92] text-white hover:bg-[#3b2371] transition-all duration-300 transform hover:scale-105"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={desktopSlideNext}
              className="p-3 rounded-full bg-[#492F92] text-white hover:bg-[#3b2371] transition-all duration-300 transform hover:scale-105"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Desktop/Tablet Slider (2 cards) */}
        <div className="hidden md:block relative ">
          <div className="overflow-hidden">
            <div
              ref={desktopSliderRef}
              className="flex shadow-2xl  transition-transform duration-500 ease-in-out"
            >
              {Array.from({ length: Math.ceil(reviews.length / 2) }).map(
                (_, slideIndex) => (
                  <div
                    key={slideIndex}
                    className="w-full flex gap-6 flex-shrink-0"
                  >
                    {reviews
                      .slice(slideIndex * 2, slideIndex * 2 + 2)
                      .map((review) => (
                        <div key={review.id} className="flex-1">
                          <ReviewCard review={review} />
                        </div>
                      ))}
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* Mobile Slider (1 card) */}
        <div className="block md:hidden">
          <div className="overflow-hidden">
            <div
              ref={mobileSliderRef}
              className="flex gap-6 transition-transform duration-500 ease-in-out"
            >
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="flex-shrink-0 w-full max-w-sm mx-auto"
                >
                  <ReviewCard review={review} />
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Navigation Arrows */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={mobileSlidePrev}
              className="p-3 rounded-full bg-[#492F92] text-white hover:bg-[#3b2371] transition-all duration-300 transform hover:scale-105"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={mobileSlideNext}
              className="p-3 rounded-full bg-[#492F92] text-white hover:bg-[#3b2371] transition-all duration-300 transform hover:scale-105"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;
