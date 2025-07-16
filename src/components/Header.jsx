import React, { useState } from "react";
import logo from "../assets/logo.png";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Services", path: "/service" },
    { name: "Contact", path: "/contact" },
    // { name: "Team", path: "/team" },
  ];

  const getLinkClass = (path) =>
    location.pathname === path
      ? "text-[#492F92]"
      : "text-[#333333] hover:text-[#3b2371] transition";

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
        <ul className="flex space-x-7 md:text-[17px] cursor-pointer font-semibold">
          {navLinks.map((link) => (
            <Link to={link.path} key={link.name}>
              <li className={getLinkClass(link.path)}>{link.name}</li>
            </Link>
          ))}
        </ul>
        <Link to="/signin">
          <button className="bg-[#492F92] text-white text-[14px] font-medium py-2 px-4 rounded cursor-pointer ml-12 hover:bg-[#3b2371] transition duration-300">
            Sign In
          </button>
        </Link>
      </div>

      {/* Mobile Nav Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white text-[#333] z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-end w-full items-center p-5 border-b border-gray-200">
          <button onClick={closeMenu} className="text-[#492F92]">
            <X size={26} />
          </button>
        </div>

        <ul className="flex flex-col space-y-6 p-6 text-[16px] font-medium">
          {navLinks.map((link) => (
            <Link to={link.path} key={link.name}>
              <li
                className={`${
                  location.pathname === link.path
                    ? "text-[#492F92]"
                    : "text-[#333333] hover:text-[#492F92]"
                }`}
                onClick={closeMenu}
              >
                {link.name}
              </li>
            </Link>
          ))}
        </ul>
      </div>

      {/* Always visible Sign In Button for mobile */}
      <div className="md:hidden ml-4">
        <Link to="/signin">
          <button className="bg-[#492F92] text-white text-[14px] font-medium py-2 px-4 rounded cursor-pointer hover:bg-[#3b2371] transition duration-300">
            Sign In
          </button>
        </Link>
      </div>
    </header>
  );
};

export default Header;
