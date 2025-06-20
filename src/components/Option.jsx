import React, { useState } from "react";
import * as Progress from "@radix-ui/react-progress";
import { Link } from "react-router-dom";

const options = [
  {
    id: "option1",
    title: "At Workshop",
    description:
      "Bring your vehicle to our certified workshop for comprehensive service.",
  },
  {
    id: "option2",
    title: "Home Service",
    description:
      "Our technicians come to your location for convenient on-site repairs.",
  },
  {
    id: "option3",
    title: "Pickup & Drop",
    description:
      "We pick up your vehicle, service it at our workshop, and return it to you.",
  },
];

const Option = () => {
  const [selectedOption, setSelectedOption] = useState("");

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Selected service method:", selectedOption);
    // Add further submission logic here
  };

  return (
    <div className="py-4 lg:py-6 px-4 sm:px-6 md:px-16 lg:px-24 w-full mx-auto ">
      {/* Progress Bar */}
      <div className="mb-6 py-5 px-10 bg-white rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-[#141414]">Progress</span>
          <span className="text-sm font-medium text-[#492F92]">
            60% completed
          </span>
        </div>
        <Progress.Root
          className="relative overflow-hidden bg-[#f3f1f7] rounded-full w-full h-4"
          value={60}
          max={100}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={60}
        >
          <Progress.Indicator
            className="bg-[#492F92] h-full transition-transform duration-500 ease-out"
            style={{ transform: "translateX(-40%)" }}
          />
        </Progress.Root>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-lg p-10 space-y-6"
      >
        <fieldset>
          <legend className="block text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#141414] mb-6">
            How will the service be conducted?
          </legend>

          <div className="flex flex-col gap-6">
            {options.map(({ id, title, description }) => (
              <label
                key={id}
                htmlFor={id}
                className="flex justify-between items-center cursor-pointer border border-gray-300 rounded-lg p-4 hover:border-[#492F92] transition-colors"
              >
                <div className="pr-4 flex-1">
                  <h3 className="font-semibold text-[#141414] text-lg">
                    {title}
                  </h3>
                  <p className="text-[#757575] text-sm mt-1">{description}</p>
                </div>
                <input
                  type="radio"
                  id={id}
                  name="serviceMethod"
                  value={id}
                  checked={selectedOption === id}
                  onChange={handleOptionChange}
                  className="w-5 h-5 text-[#492F92] accent-[#492F92]"
                  required
                />
              </label>
            ))}
          </div>
        </fieldset>

        <div className="w-full flex justify-end">
          <Link to="/book-forth">
            {" "}
            <button
              type="submit"
              className="w-fit px-6 bg-[#492F92] cursor-pointer text-white py-3 rounded shadow hover:bg-[#3a236d] transition-colors font-semibold"
            >
              Continue
            </button>{" "}
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Option;
