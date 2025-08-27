import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for routing
import logo from "../assets/logo.png";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  const navigate = useNavigate(); // Initialize navigate hook

  // Function to scroll to the booking form
  const handleScrollToForm = () => {
    // Navigate to homepage first if not already there
    navigate("/");
    // Use setTimeout to ensure the page has loaded before scrolling
    setTimeout(() => {
      const formElement = document.getElementById("booking-form");
      if (formElement) {
        formElement.scrollIntoView({ behavior: "smooth" });
      } else {
        console.error("Booking form element not found");
      }
    }, 100); // Small delay to ensure DOM is ready
  };

  return (
    <footer className="pb-8 lg:px-20 md:px-16 sm:px-12 px-4">
      <div className="bg-[#EFECE0] py-6 px-15">
        <div className="flex flex-wrap md:justify-between gap-8 pb-10 border-b border-b-[#503535]">
          {/* 1. Logo, Text, Socials */}
          <div className="md:w-1/3 flex flex-col items-center md:items-start text-center md:text-left gap-6">
            <img src={logo} alt="Logo" className="w-28 h-auto mb-2" />
            <p className="text-base text-[#503535] mb-2 md:w-4/5">
              Your go-to platform for trusted auto repairs, diagnostics, and car
              maintenance — serving all car brands from Bentley to Honda.
            </p>
            <div className="flex gap-3 justify-center md:justify-start">
              <a
                href="#"
                className="hover:text-[#F7CD3A] text-[#503535] transition"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="hover:text-[#F7CD3A] text-[#503535] transition"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="hover:text-[#F7CD3A] text-[#503535] transition"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="hover:text-[#F7CD3A] text-[#503535] transition"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* 2. Links Group 1 */}
          <div className="flex-1">
            <h3 className="uppercase font-bold mb-4 text-[#333333]">
              Gapa Auto Fix
            </h3>
            <ul className="space-y-2 text-[#333333]">
              <li>
                <button
                  onClick={handleScrollToForm}
                  className="hover:text-[#F7CD3A] transition"
                >
                  Book a Service
                </button>
              </li>
              <li>
                <a href="#" className="hover:text-[#F7CD3A] transition">
                  Service Tracker
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#F7CD3A] transition">
                  How It Works
                </a>
              </li>
            </ul>
          </div>

          {/* 3. Links Group 2 */}
          <div className="flex-1">
            <h3 className="uppercase font-bold mb-4 text-[#333333]">
              Services
            </h3>
            <ul className="space-y-2 text-[#333333]">
              <li>
                <a href="#" className="hover:text-[#F7CD3A] transition">
                  At-Home Repairs
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#F7CD3A] transition">
                  Diagnostics
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#F7CD3A] transition">
                  Maintenance Plans
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#F7CD3A] transition">
                  Emergency Support
                </a>
              </li>
            </ul>
          </div>

          {/* 4. Links Group 3 */}
          <div className="flex-1">
            <h3 className="uppercase font-bold mb-4 text-[#333333]">Company</h3>
            <ul className="space-y-2 text-[#333333]">
              <li>
                <a
                  href="/about"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/about");
                  }}
                  className="hover:text-[#F7CD3A] transition"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/contact");
                  }}
                  className="hover:text-[#F7CD3A] transition"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#F7CD3A] transition">
                  Terms & Policies
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#F7CD3A] transition">
                  How It Works
                </a>
              </li>
            </ul>
          </div>
        </div>
        {/* Copyright */}
        <div className="mt-10 text-center text-xs text-black">
          &copy; {new Date().getFullYear()} Your Company Name. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
