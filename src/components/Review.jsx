import React from "react";
import * as Progress from "@radix-ui/react-progress";
import {
  Car,
  Truck,
  Wrench,
  CalendarClock,
  MapPin,
  Wallet,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

const requestData = [
  {
    id: 1,
    title: "Vehicle",
    detail: "2018 Honda Civic",
    icon: (
      <Car className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-[#492F92]" />
    ),
    editLink: "/book-first",
  },
  {
    id: 2,
    title: "Model",
    detail: "Tesla Model X",
    icon: (
      <Truck className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-[#492F92]" />
    ),
    editLink: "/book-first",
  },
  {
    id: 3,
    title: "Service",
    detail: "Oil change",
    icon: (
      <Wrench className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-[#492F92]" />
    ),
    editLink: "/book-second",
  },
  {
    id: 4,
    title: "Appointment",
    detail: "Jun 20, 2025, 10:00 AM",
    icon: (
      <CalendarClock className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-[#492F92]" />
    ),
    editLink: "/book-forth",
  },
  {
    id: 5,
    title: "Location",
    detail: "2000 Princess Estate, Queensway, Abuja",
    icon: (
      <MapPin className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-[#492F92]" />
    ),
    editLink: "/book-forth",
  },
  {
    id: 6,
    title: "Estimate",
    detail: "₦20,000 - ₦50,000",
    icon: (
      <Wallet className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-[#492F92]" />
    ),
    editLink: "/book-forth",
  },
];

const Review = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen py-4 lg:py-6 px-2 sm:px-4 md:px-8 lg:px-24 w-full mx-auto">
      {/* Progress Bar */}
      <div className="mb-6 py-5 px-10 bg-white rounded-lg">
        <div className="flex items-center justify-between mb-1 text-xs sm:text-sm">
          <span className="font-medium text-[#141414]">Progress</span>
          <span className="font-medium text-[#492F92]">100% completed</span>
        </div>
        <Progress.Root
          className="relative overflow-hidden bg-[#e8e6f0] rounded-full w-full h-4"
          value={100}
          max={100}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={100}
        >
          <Progress.Indicator
            className="bg-[#492F92] h-full transition-transform duration-500 ease-out"
            style={{ width: "100%" }}
          />
        </Progress.Root>
      </div>

      {/* Main Card */}
      <div className="w-full bg-white rounded-lg p-2 sm:p-4 md:p-6 flex flex-col  shadow">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#141414] text-center mb-4 sm:mb-6">
          Review your request
        </h2>

        {/* Request Items */}
        <div className="w-full space-y-2 sm:space-y-4">
          {requestData.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between border-b border-b-[#33333333] p-2 sm:p-3"
            >
              <div className="flex items-center space-x-2 sm:space-x-4">
                <h1 className="bg-[#F2F2F2] p-1.5 "> {item.icon} </h1>
                <div>
                  <p className="text-xs sm:text-sm md:text-base font-medium text-[#141414]">
                    {item.title}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {item.detail}
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate(item.editLink)}
                className="text-xs sm:text-sm text-[#141414] focus:outline-none font-semibold"
              >
                Edit
              </button>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <Link to="/">
          {" "}
          <button
            type="submit"
            className="w-fit mt-8 sm:mt-12 px-6 sm:px-8 py-2 sm:py-4 bg-[#492F92] text-white rounded shadow hover:bg-[#3a236d] transition-colors font-semibold text-xs sm:text-sm cursor-pointer"
          >
            Submit request
          </button>{" "}
        </Link>
      </div>
    </div>
  );
};

export default Review;
