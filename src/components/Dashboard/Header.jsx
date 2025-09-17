import React from "react";
import profile from "../../assets/Profile.png";
import { BellIcon, MailIcon, SearchIcon, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

const Header = ({ open, setOpen }) => {
  return (
    <>
      {/* Mobile Header (<sm, enforced three rows) */}
      <header className="sm:hidden bg-white px-2 py-2 flex flex-col gap-2">
        {/* Row 1: Hamburger and Welcome */}
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={() => {
              console.log("Toggling Sidebar, current open state:", open);
              setOpen(!open);
            }}
          >
            {open ? (
              <X className="w-6 h-6 text-[#333333]" />
            ) : (
              <Menu className="w-6 h-6 text-[#333333]" />
            )}
          </button>
          <div>
            <h1 className="text-lg text-[#333333] font-semibold">
              Welcome, Stella!
            </h1>
            <p className="text-[#747681] font-light text-xs">
              Let’s check your Garage today
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <MailIcon className="w-5 h-5 text-[#333333]" />
              <span className="absolute top-0 right-0 block h-1.5 w-1.5 rounded-full bg-red-500 ring-1 ring-white"></span>
            </div>
            <div className="relative">
              <BellIcon className="w-5 h-5 text-[#333333]" />
              <span className="absolute top-0 right-0 block h-1.5 w-1.5 rounded-full bg-red-500 ring-1 ring-white"></span>
            </div>
            <img
              src={profile}
              alt="Profile"
              className="w-6 h-6 rounded-full object-cover"
            />
          </div>
        </div>

        {/* Row 2: Logo */}
        <div className="flex justify-center">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search..."
              className="bg-[#F5F5F5] rounded-md outline-none px-2 pl-6 py-0.5 w-full text-sm"
            />
            <SearchIcon className="absolute top-0.5 left-1 opacity-60 w-4 h-4 text-[#333333]" />
          </div>
        </div>

        {/* Row 3: Search, Notifications, Profile, Button */}
        <div className="flex flex-wrap justify-between items-center gap-2">
          <Link to="/">
            <img src={logo} alt="CarFlex Logo" className="h-10" />
          </Link>
          <button className="text-white bg-[#4B3193] px-2 py-1 rounded-lg text-xs font-medium">
            Schedule Maintenance
          </button>
        </div>
      </header>

      {/* Tablet Header (sm to <lg, single header with flex-wrap) */}
      <header className="hidden sm:flex lg:hidden bg-white px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        {/* Left: Hamburger and Welcome */}
        <div className="flex items-center gap-4">
          <div>
            <button
              onClick={() => {
                console.log("Toggling Sidebar, current open state:", open);
                setOpen(!open);
              }}
            >
              {open ? (
                <X className="w-6 h-6 text-[#333333]" />
              ) : (
                <Menu className="w-6 h-6 text-[#333333]" />
              )}
            </button>
          </div>
          <div>
            <h1 className="text-xl sm:text-[22px] text-[#333333] font-semibold">
              Welcome, Stella!
            </h1>
            <p className="text-[#747681] font-light text-sm">
              Let’s check your Garage today
            </p>
          </div>
        </div>

        {/* Center: Logo */}
        <div className="flex items-center">
          <Link to="/">
            <img src={logo} alt="CarFlex Logo" className="h-10" />
          </Link>
        </div>

        {/* Right: Search, Notifications, Profile, Button */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative w-full sm:w-40 max-w-xs">
            <input
              type="text"
              placeholder="Search..."
              className="bg-[#F5F5F5] rounded-md outline-none px-3 pl-7 py-1 w-full"
            />
            <SearchIcon className="absolute top-1 left-1 opacity-60 w-5 h-5 text-[#333333]" />
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <MailIcon className="w-6 h-6 text-[#333333]" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            </div>
            <div className="relative">
              <BellIcon className="w-6 h-6 text-[#333333]" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            </div>
            <img
              src={profile}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover"
            />
          </div>
          <button className="flex items-center text-white bg-[#4B3193] px-4 py-2 rounded-xl text-sm font-medium">
            Schedule Maintenance
          </button>
        </div>
      </header>

      {/* Desktop Header (lg and up, original dual-header structure) */}
      <div className="hidden lg:flex lg:flex-col px-16 bg-white">
        <header className="p-4 flex flex-wrap items-center justify-start md:justify-between gap-4">
          <div className="lg:hidden">
            <button
              onClick={() => {
                console.log("Toggling Sidebar, current open state:", open);
                setOpen(!open);
              }}
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
          <div>
            <h1 className="text-xl md:text-[22px] text-[#333333] font-semibold">
              Welcome, Stella!
            </h1>
            <p className="text-[#747681] font-light text-sm">
              Let’s check your Garage today
            </p>
          </div>
          <div className="relative md:w-[30%] flex-grow max-w-[180px] md:max-w-xs">
            <input
              type="text"
              placeholder="Search..."
              className="bg-[#F5F5F5] rounded-md outline-none px-3 pl-7 py-1 w-full"
            />
            <SearchIcon className="absolute top-1 opacity-60 w-5 h-5 left-1 text-[#333333]" />
          </div>
          <div className="flex items-center gap-4 md:space-x-10">
            <div className="relative">
              <MailIcon className="w-6 h-6" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            </div>
            <div className="relative">
              <BellIcon className="w-6 h-6" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            </div>
            <img
              src={profile}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover"
            />
          </div>
        </header>
        <header className="bg-[#F2F2F2] rounded-xl mb-3">
          <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <div className="flex justify-between items-center h-12">
              <div className="flex items-center space-x-4">
                <Link to="/">
                  <img src={logo} alt="CarFlex Logo" className="h-10" />
                </Link>
              </div>
              <button className="flex items-center text-white space-x-2 bg-[#4B3193] px-6 py-2 rounded-xl">
                Schedule Maintenance
              </button>
            </div>
          </div>
        </header>
      </div>
    </>
  );
};

export default Header;
