import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { Car, Wrench, MapPin, ChevronDown } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  Droplets,
  Disc,
  ScanLine,
  Gauge,
  CircleDot,
  Car as CarIcon,
  Wrench as WrenchIcon,
} from "lucide-react";
import { toast } from "react-toastify";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

import heroBg1 from "../assets/banner1.png";
import heroBg2 from "../assets/banner2.png";
import heroBg3 from "../assets/banner3.png";
import heroBg4 from "../assets/banner4.png";
import mobileBanner1 from "../assets/mbanner1.png";
import mobileBanner2 from "../assets/mbanner2.png";
import mobileBanner3 from "../assets/mbanner3.png";
import mobileBanner4 from "../assets/mbanner4.png";
import { locations, serviceIcons, services } from "../utils/formFields";

const cx = (...parts) => parts.flat().filter(Boolean).join(" ");

const Hero = () => {
  const navigate = useNavigate();

  // Responsive images
  const desktopImages = useMemo(() => [heroBg1, heroBg2, heroBg3, heroBg4], []);
  const mobileImages = useMemo(
    () => [mobileBanner1, mobileBanner2, mobileBanner3, mobileBanner4],
    []
  );

  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" &&
      window.matchMedia("(max-width: 767px)").matches
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);

  const images = isMobile ? mobileImages : desktopImages;

  // Form state
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [brands, setBrands] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dropdown open state & helpers
  const [dropdownOpen, setDropdownOpen] = useState({
    vehicle: false,
    service: false,
    location: false,
  });
  const anyDropdownOpen = Object.values(dropdownOpen).some(Boolean);

  const toggleDropdown = useCallback((type) => {
    setDropdownOpen((prev) => ({
      vehicle: type === "vehicle" ? !prev.vehicle : false,
      service: type === "service" ? !prev.service : false,
      location: type === "location" ? !prev.location : false,
    }));
  }, []);

  const handleSelection = useCallback((type, value) => {
    if (type === "vehicle") setSelectedVehicle(value);
    if (type === "service") setSelectedService(value);
    if (type === "location") setSelectedLocation(value);

    setDropdownOpen((prev) => ({ ...prev, [type]: false }));
  }, []);

  // Refs for outside-click detection
  const vehicleRef = useRef(null);
  const serviceRef = useRef(null);
  const locationRef = useRef(null);
  const vehicleBtnRef = useRef(null);
  const serviceBtnRef = useRef(null);
  const locationBtnRef = useRef(null);

  useEffect(() => {
    const handlePointerDown = (event) => {
      const refs = [
        { wrapper: vehicleRef, button: vehicleBtnRef },
        { wrapper: serviceRef, button: serviceBtnRef },
        { wrapper: locationRef, button: locationBtnRef },
      ];

      // If click is outside all wrappers and buttons, close all dropdowns
      const clickedInsideAny = refs.some(({ wrapper, button }) => {
        const w = wrapper.current;
        const b = button.current;
        return (
          (w && w.contains(event.target)) || (b && b.contains(event.target))
        );
      });

      if (!clickedInsideAny) {
        setDropdownOpen({ vehicle: false, service: false, location: false });
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  // Fetch brands
  useEffect(() => {
    let cancelled = false;
    axios
      .get("https://stockmgt.gapaautoparts.com/api/brand/all-brand")
      .then((res) => {
        if (cancelled) return;
        const raw = res.data?.brands ?? [];
        const normalized = raw.map((b) =>
          typeof b === "string"
            ? { name: b }
            : b?.name
            ? b
            : { name: String(b) }
        );
        setBrands(normalized);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Error fetching car brands", err);
        setBrands([{ name: "Toyota" }, { name: "Honda" }, { name: "Ford" }]);
        toast.error("Failed to fetch car brands. Using fallback data.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Preload images
  useEffect(() => {
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [images]);

  // Booking handler
  const handleBookService = useCallback(async () => {
    if (!selectedVehicle || !selectedService || !selectedLocation) {
      toast.error(
        "Please select your vehicle, service, and location before proceeding."
      );
      return;
    }
    setIsSubmitting(true);
    try {
      const { data } = await axios.post(
        "https://api.gapafix.com.ng/api/bookings/start",
        {
          vehicle_type: selectedVehicle,
          service_required: selectedService,
          service_center: selectedLocation,
        }
      );
      const bookingId = data?.booking_id;
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
    } catch (err) {
      console.error(err);
      toast.error("Failed to start booking. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedVehicle, selectedService, selectedLocation, navigate]);

  // Dropdown component (keeps DOM mounted so scrollTop is preserved)
  /* eslint-disable no-unused-vars */
  const Dropdown = ({
    type,
    Icon,
    placeholder,
    options,
    selectedValue,
    isOpen,
    wrapperRef,
    buttonRef,
  }) => {
    return (
      <div className="relative" ref={wrapperRef} aria-expanded={isOpen}>
        <button
          ref={buttonRef}
          type="button"
          onClick={() => toggleDropdown(type)}
          className="cursor-pointer w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-3 text-left text-[#E5E5E5] hover:bg-white/15 transition-all duration-200 focus:outline-none"
          disabled={isSubmitting}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Icon className="w-5 h-5 text-[#F7CD3A]" />
              <span className="text-sm md:text-base lg:text-lg">
                {selectedValue || placeholder}
              </span>
            </div>
            <ChevronDown
              className={cx(
                "w-5 h-5 text-[#F7CD3A] transition-transform duration-200",
                isOpen && "rotate-180"
              )}
            />
          </div>
        </button>

        {/* always mounted, visibility toggled via classes to preserve scroll */}
        <div
          className={cx(
            "absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 overflow-hidden transform transition-all duration-150",
            isOpen
              ? "z-50 opacity-100 scale-100 pointer-events-auto"
              : "opacity-0 scale-[0.98] pointer-events-none"
          )}
          role="listbox"
          aria-hidden={!isOpen}
        >
          <div
            className="max-h-48 overflow-y-auto"
            onPointerDown={(e) => e.stopPropagation()}
          >
            {options && options.length > 0 ? (
              options.map((option, idx) => {
                const name = option?.name ?? option;
                return (
                  <button
                    key={String(idx)}
                    type="button"
                    onClick={() => handleSelection(type, name)}
                    className="w-full px-4 py-3 text-left text-gray-700 hover:bg-[#F7CD3A] hover:text-[#492F92] transition-colors duration-150 text-sm md:text-base border-b border-gray-200 last:border-b-0"
                    disabled={isSubmitting}
                  >
                    {name}
                  </button>
                );
              })
            ) : (
              <div className="p-4 text-sm text-gray-500">No options</div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="relative flex flex-col h-auto min-h-screen md:h-[90vh] overflow-hidden">
      {/* Swiper slider */}
      <div className="absolute inset-0 z-0">
        <Swiper
          modules={[Autoplay]}
          slidesPerView={1}
          loop={true}
          autoplay={
            anyDropdownOpen
              ? false
              : { delay: 3000, disableOnInteraction: false }
          }
          allowTouchMove={true}
        >
          {images.map((src, i) => (
            <SwiperSlide key={i}>
              <div
                className="w-full h-full bg-center bg-no-repeat bg-cover"
                style={{ backgroundImage: `url(${src})`, minHeight: "100vh" }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="absolute inset-0 bg-black/10 pointer-events-none" />
      </div>

      {/* form */}
      <div
        id="booking-form"
        className="relative z-10 flex items-start justify-end inset-x-0 px-4 sm:px-10 py-10 md:py-0 transform md:translate-y-14"
      >
        <div className="w-full max-w-md sm:max-w-lg p-4 sm:p-6 bg-[#492F92]/80 rounded-lg shadow-xl">
          <h1 className="text-[#E5E5E5] font-bold text-lg sm:text-xl md:text-2xl mb-4 sm:mb-6 leading-tight text-center">
            Book Trusted Car Care in Minutes
          </h1>

          <div className="space-y-4 mb-4 sm:mb-6">
            <Dropdown
              type="vehicle"
              Icon={Car}
              placeholder="What do you drive?"
              options={brands}
              selectedValue={selectedVehicle}
              isOpen={dropdownOpen.vehicle}
              wrapperRef={vehicleRef}
              buttonRef={vehicleBtnRef}
            />
            <Dropdown
              type="service"
              Icon={Wrench}
              placeholder="What service do you require?"
              options={services.map((s) => ({ name: s }))}
              selectedValue={selectedService}
              isOpen={dropdownOpen.service}
              wrapperRef={serviceRef}
              buttonRef={serviceBtnRef}
            />
            <Dropdown
              type="location"
              Icon={MapPin}
              placeholder="Our Service Centers"
              options={locations.map((l) => ({ name: l }))}
              selectedValue={selectedLocation}
              isOpen={dropdownOpen.location}
              wrapperRef={locationRef}
              buttonRef={locationBtnRef}
            />
          </div>

          <button
            type="button"
            onClick={handleBookService}
            disabled={isSubmitting}
            className={cx(
              "bg-[#F7CD3A] w-full text-[#492F92] font-semibold py-2 sm:py-3 rounded-lg transition-all duration-200",
              isSubmitting
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-[#F7CD3A]/90 hover:scale-[1.02] hover:shadow-lg"
            )}
          >
            {isSubmitting ? "Submitting..." : "Book a Service"}
          </button>
        </div>
      </div>

      {/* service icons */}
      <div className="relative mt-auto bg-[#492F92]/95 w-full md:w-[90%] mx-auto h-fit px-4 py-3">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-2 divide-x-0 sm:divide-x divide-gray-300">
          {serviceIcons.map((service, idx) => {
            const Icon = service.icon;
            return (
              <Link
                key={idx}
                to={service.route}
                className="flex flex-col items-center px-2 sm:px-4 py-2 text-center"
              >
                <Icon className="w-6 sm:w-8 h-6 sm:h-8 text-[#F7CD3A] mb-2" />
                <p className="text-xs sm:text-sm font-medium text-[#E5E5E5]">
                  {service.title}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Hero;
