import React, { useState, useEffect, useMemo } from "react";
import { Car, Wrench, MapPin, ChevronDown } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  Droplets,
  Disc,
  ScanLine,
  Gauge,
  CircleDot,
  WrenchIcon,
  Car as CarIcon,
} from "lucide-react";
import { toast } from "react-toastify";
import heroBg1 from "../assets/banner1.png";
import heroBg2 from "../assets/banner2.png";
import heroBg3 from "../assets/banner3.png";
import heroBg4 from "../assets/banner4.png";
import mobileBanner1 from "../assets/mbanner1.png";
import mobileBanner2 from "../assets/mbanner2.png";
import mobileBanner3 from "../assets/mbanner3.png";
import mobileBanner4 from "../assets/mbanner4.png";

const Hero = () => {
  const navigate = useNavigate();

  // Define image sets for desktop and mobile
  const desktopImages = useMemo(() => [heroBg1, heroBg2, heroBg3, heroBg4], []);
  const mobileImages = useMemo(
    () => [mobileBanner1, mobileBanner2, mobileBanner3, mobileBanner4],
    []
  );

  // State to track screen size
  const [isMobile, setIsMobile] = useState(
    window.matchMedia("(max-width: 767px)").matches
  );

  // Update isMobile state on window resize
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const handleResize = () => setIsMobile(mediaQuery.matches);

    mediaQuery.addEventListener("change", handleResize);
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  // Select images based on screen size
  const images = isMobile ? mobileImages : desktopImages;
  const [currentImage, setCurrentImage] = useState(0);
  const [direction, setDirection] = useState(1);
  const totalImages = images.length;

  // Slider logic
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => {
        if (prev === totalImages - 1 && direction === 1) {
          setDirection(-1);
          return prev - 1;
        } else if (prev === 0 && direction === -1) {
          setDirection(1);
          return prev + 1;
        } else {
          return prev + direction;
        }
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [direction, totalImages]);

  // Preload images (both sets)
  useEffect(() => {
    [...desktopImages, ...mobileImages].forEach((image) => {
      const img = new Image();
      img.src = image;
    });
  }, [desktopImages, mobileImages]);

  const extendedImages = [...images, ...images];

  const serviceIcons = [
    { title: "Oil Service", icon: Droplets, route: "/service" },
    { title: "Brake System Service", icon: Disc, route: "/service" },
    { title: "Diagnostic Services", icon: ScanLine, route: "/service" },
    { title: "Engine Check", icon: Gauge, route: "/service" },
    {
      title: "Wheel Balancing & Alignment",
      icon: CircleDot,
      route: "/service",
    },
    {
      title: "Car Part",
      icon: WrenchIcon,
      route: "https://gapaautoparts.com/",
    },
  ];

  // Trust form logic
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [brands, setBrands] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState({
    vehicle: false,
    service: false,
    location: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false); // New loading state

  const services = [
    "Oil Service",
    "Brake System Service",
    "Diagnostic Services",
    "Paint & Bodywork",
    "Wheel Balancing & Alignment",
    "Tyre Change",
    "Car Detailing",
    "Suspension Systems",
    "Comprehensive Repairs",
    "Engine Check",
  ];

  const locations = [
    "Giwa Barracks Car Park, Ikoyi, Lagos",
    "Kilometer 15, Lekki Epe Expressway, By Jakande Roundabout, Lekki, Lagos",
  ];

  const handleBookService = async () => {
    if (!selectedVehicle || !selectedService || !selectedLocation) {
      toast.error(
        "Please select your vehicle, service, and location before proceeding."
      );
      return;
    }

    setIsSubmitting(true); // Start loading
    try {
      const response = await axios.post(
        "https://api.gapafix.com.ng/api/bookings/start",
        {
          vehicle_type: selectedVehicle,
          service_required: selectedService,
          service_center: selectedLocation,
        }
      );

      const bookingId = response.data.booking_id; // Adjust based on actual API response

      navigate("/profile", {
        state: {
          trustData: {
            vehicle: selectedVehicle,
            service: selectedService,
            location: selectedLocation,
            bookingId,
          },
        },
      });
    } catch (error) {
      console.error("Error starting booking:", error);
      toast.error("Failed to start booking. Please try again.");
    } finally {
      setIsSubmitting(false); // Stop loading
    }
  };

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
    <div className="relative">
      <button
        onClick={() => toggleDropdown(type)}
        className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-3 text-left text-[#E5E5E5] hover:bg-white/15 transition-all duration-300 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#F7CD3A] focus:ring-opacity-50"
        disabled={isSubmitting} // Disable dropdown during submission
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
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 overflow-hidden">
          <div className="max-h-48 overflow-y-auto">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSelection(type, option.name)}
                className="w-full px-4 py-3 text-left text-gray-700 hover:bg-[#F7CD3A] hover:text-[#492F92] transition-colors duration-200 text-sm md:text-base border-b border-gray-200 last:border-b-0"
                disabled={isSubmitting} // Disable options during submission
              >
                {option.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // Fetch car brands
  useEffect(() => {
    axios
      .get("https://stockmgt.gapaautoparts.com/api/brand/all-brand")
      .then((res) => {
        setBrands(res.data.brands || []);
      })
      .catch((err) => {
        console.error("Error fetching car brands", err);
        setBrands([{ name: "Toyota" }, { name: "Honda" }, { name: "Ford" }]);
        toast.error("Failed to fetch car brands. Using fallback data.");
      });
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".relative")) {
        setDropdownOpen({ vehicle: false, service: false, location: false });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <section className="relative h-auto min-h-screen md:h-[90vh] overflow-hidden">
      {/* Background slider */}
      <div
        className="absolute inset-0 flex"
        style={{
          transform: `translateX(-${
            (currentImage * 100) / (totalImages * 2)
          }%)`,
          width: `${extendedImages.length * 100}%`,
          transition: "transform 700ms ease-in-out",
        }}
      >
        {extendedImages.map((image, index) => (
          <div
            key={index}
            className="w-full h-full bg-center bg-no-repeat bg-cover"
            style={{
              backgroundImage: `url(${image})`,
              flex: `0 0 ${100 / extendedImages.length}%`,
            }}
          />
        ))}
      </div>

      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-black/10 z-0"></div>

      {/* Centered form */}
      <div
        className="absolute inset-0 flex items-start justify-end z-10 px-4 sm:px-10"
        style={{ transform: "translateY(50px)" }}
      >
        <div className="w-full max-w-md sm:max-w-lg p-4 sm:p-6 bg-[#492F92]/80 rounded-lg shadow-xl">
          <h1 className="text-[#E5E5E5] font-bold text-lg sm:text-xl md:text-2xl mb-4 sm:mb-6 leading-tight text-center">
            Book Trusted Car Care in Minutes
          </h1>
          <div className="space-y-4 mb-4 sm:mb-6">
            <Dropdown
              type="vehicle"
              icon={Car}
              placeholder="What do you drive?"
              options={brands}
              selectedValue={selectedVehicle}
              isOpen={dropdownOpen.vehicle}
            />
            <Dropdown
              type="service"
              icon={Wrench}
              placeholder="What service do you require?"
              options={services.map((s) => ({ name: s }))}
              selectedValue={selectedService}
              isOpen={dropdownOpen.service}
            />
            <Dropdown
              type="location"
              icon={MapPin}
              placeholder="Our Service Centers"
              options={locations.map((l) => ({ name: l }))}
              selectedValue={selectedLocation}
              isOpen={dropdownOpen.location}
            />
          </div>
          <button
            onClick={handleBookService}
            className={`bg-[#F7CD3A] w-full text-[#492F92] font-semibold py-2 sm:py-3 rounded-lg hover:bg-[#F7CD3A]/90 transition-all duration-300 ease-in-out transform hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#F7CD3A] focus:ring-opacity-50 flex items-center justify-center ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-[#492F92]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                  ></path>
                </svg>
                Submitting...
              </>
            ) : (
              "Book a Service"
            )}
          </button>
        </div>
      </div>

      {/* Services Icons Section */}
      <div className="absolute left-1/2 -translate-x-1/2 bg-[#492F92]/95 w-full md:w-[90%] z-20 mx-auto h-fit bottom-0 px-4 py-3">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {serviceIcons.map((service, idx) => (
            <Link
              key={idx}
              to={service.route}
              className={`flex flex-col items-center h-full text-center px-2 sm:px-4 py-2 border-gray-300
                ${idx !== serviceIcons.length - 1 && "md:border-r"} 
                ${idx % 2 !== 1 && "sm:border-r"} 
                ${idx >= serviceIcons.length - 2 && "sm:border-r-0"}`}
            >
              {React.createElement(service.icon, {
                className: "w-6 sm:w-8 h-6 sm:h-8 text-[#F7CD3A] mb-2",
              })}
              <p className="text-xs sm:text-sm md:text-base font-medium text-[#E5E5E5]">
                {service.title}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
