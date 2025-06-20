import React, { useState } from "react";
import logo from "../assets/logo.png";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="flex justify-between items-center py-6 lg:px-20 md:px-16 sm:px-12 px-4 text-white relative">
      {/* Mobile Hamburger */}
      <div className="md:hidden flex items-center">
        <button onClick={toggleMenu} className="text-[#492F92]">
          <Menu size={28} />
        </button>
      </div>
      {/* Logo */}
      <div>
        <img src={logo} alt="Logo" className="w-28" />
      </div>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center">
        <ul className="flex space-x-7 md:text-[17px] cursor-pointer text-[#333333] font-semibold">
          <Link to="/">
            {" "}
            <li className="text-[#492F92] hover:text-[#3b2371] transition">
              Home
            </li>{" "}
          </Link>
          <Link to="/about">
            <li className="hover:text-[#3b2371] transition">About Us</li>
          </Link>
          <Link to="/service">
            <li className="hover:text-[#3b2371] transition">Services</li>
          </Link>
          <Link to="/contact">
            <li className="hover:text-[#3b2371] transition">Contact</li>
          </Link>
          <Link to="/team">
            <li className="hover:text-[#3b2371] transition">Team</li>
          </Link>
        </ul>
        <Link to="/signin">
          {" "}
          <button className="bg-[#492F92] text-white text-[14px] font-medium py-2 px-4 rounded cursor-pointer ml-12 hover:bg-[#3b2371] transition duration-300">
            Sign In
          </button>{" "}
        </Link>
      </div>

      {/* Mobile Nav Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white text-[#333] z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-end w-full items-center p-5 border-b border-gray-200">
          {/* <img src={logo} alt="Logo" className="w-24" /> */}
          <button onClick={closeMenu} className="text-[#492F92]">
            <X size={26} />
          </button>
        </div>

        <ul className="flex flex-col space-y-6 p-6 text-[16px] font-medium">
          <Link to="/">
            {" "}
            <li className="hover:text-[#492F92]" onClick={closeMenu}>
              Home
            </li>{" "}
          </Link>
          <Link to="/about">
            <li className="hover:text-[#492F92]" onClick={closeMenu}>
              About Us
            </li>{" "}
          </Link>
          <Link to="/service">
            <li className="hover:text-[#492F92]" onClick={closeMenu}>
              Services
            </li>{" "}
          </Link>
          <Link to="/contact">
            <li className="hover:text-[#492F92]" onClick={closeMenu}>
              Contact
            </li>
          </Link>
          <Link to="/team">
            {" "}
            <li className="hover:text-[#492F92]" onClick={closeMenu}>
              Team
            </li>{" "}
          </Link>
        </ul>
      </div>

      {/* Always visible Sign In Button for mobile */}
      <div className="md:hidden ml-4">
        <Link to="/signin">
          {" "}
          <button className="bg-[#492F92] text-white text-[14px] font-medium py-2 px-4 rounded cursor-pointer hover:bg-[#3b2371] transition duration-300">
            Sign In
          </button>{" "}
        </Link>
      </div>
    </header>
  );
};

export default Header;
