import React, { useState } from "react";
import { Car, Wrench, MapPin, ChevronDown } from "lucide-react";
import trust from "../assets/trust.png";

const Trust = () => {
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState({
    vehicle: false,
    service: false,
    location: false,
  });

  const vehicles = [
    "Sedan",
    "SUV",
    "Truck",
    "Hatchback",
    "Coupe",
    "Convertible",
    "Van",
    "Motorcycle",
  ];

  const services = [
    "Oil Change",
    "Brake Service",
    "Engine Diagnostics",
    "Tire Service",
    "Battery Service",
    "Air Conditioning",
    "Transmission Service",
    "General Maintenance",
  ];

  const locations = [
    "Downtown",
    "North Side",
    "South Side",
    "East Side",
    "West Side",
    "Suburbs",
    "Business District",
    "Airport Area",
  ];

  const toggleDropdown = (type) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const handleSelection = (type, value) => {
    if (type === "vehicle") setSelectedVehicle(value);
    if (type === "service") setSelectedService(value);
    if (type === "location") setSelectedLocation(value);

    setDropdownOpen((prev) => ({
      ...prev,
      [type]: false,
    }));
  };

  const Dropdown = ({
    type,
    icon,
    placeholder,
    options,
    selectedValue,
    isOpen,
  }) => (
    <div className="relative md:mb-8 mb-4">
      <button
        onClick={() => toggleDropdown(type)}
        className="w-full bg-white/10 backdrop-blur-sm cursor-pointer  border border-white/20 rounded-lg px-4 py-3 text-left text-[#E5E5E5] hover:bg-white/15 transition-all duration-300 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#F7CD3A] focus:ring-opacity-50"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {React.createElement(icon, { className: "w-5 h-5 text-[#F7CD3A]" })}
            <span className="text-sm md:text-base lg:text-lg">
              {selectedValue || placeholder}
            </span>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-[#F7CD3A] transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 overflow-hidden animate-in slide-in-from-top-2 duration-200">
          <div className="max-h-48 overflow-y-auto">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSelection(type, option)}
                className="w-full px-4 py-3 text-left text-gray-700 hover:bg-[#F7CD3A] hover:text-[#492F92] transition-colors duration-200 text-sm md:text-base border-b border-gray-100 last:border-b-0"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".relative")) {
        setDropdownOpen({
          vehicle: false,
          service: false,
          location: false,
        });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <section className="bg-[#f3f1f7] py-8 md:py-12 lg:py-16 lg:px-20 md:px-16 sm:px-12 px-4">
      <div className="flex flex-col md:flex-row w-full mx-auto bg-[#f3f1f7]">
        <div className="w-full md:w-1/2 p-6 md:p-8 lg:p-12 bg-[#492F92] rounded-t-lg md:rounded-l-lg md:rounded-tr-none">
          <h1 className="text-[#E5E5E5] font-bold text-xl md:text-2xl  mb-6 md:mb-8 leading-tight">
            Book Trusted Car Care in Minutes
          </h1>

          <div className="space-y-4 mb-6 md:mb-8">
            <Dropdown
              type="vehicle"
              icon={Car}
              placeholder="What do you drive?"
              options={vehicles}
              selectedValue={selectedVehicle}
              isOpen={dropdownOpen.vehicle}
              className="cursor-pointer"
            />

            <Dropdown
              type="service"
              icon={Wrench}
              placeholder="What service do you need?"
              options={services}
              selectedValue={selectedService}
              isOpen={dropdownOpen.service}
            />

            <Dropdown
              type="location"
              icon={MapPin}
              placeholder="Your location?"
              options={locations}
              selectedValue={selectedLocation}
              isOpen={dropdownOpen.location}
            />
          </div>

          <button className="bg-[#F7CD3A] w-full cursor-pointer text-[#492F92] font-semibold py-3 md:py-4 px-4 rounded-lg hover:bg-[#F7CD3A]/90 transition-all duration-300 ease-in-out transform hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#F7CD3A] focus:ring-opacity-50 text-sm md:text-base lg:text-lg">
            Book a Service
          </button>
        </div>

        <div className="w-full md:w-1/2  rounded-b-lg md:rounded-r-lg md:rounded-bl-none overflow-hidden">
          <img src={trust} alt="trust" className="w-full h-full object-cover" />
        </div>
      </div>
    </section>
  );
};

export default Trust;
