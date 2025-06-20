import React from "react";
import profile from "../../assets/profile.png";
import { BellIcon, MailIcon, SearchIcon, Menu, X } from "lucide-react";

const Header = ({ open, setOpen }) => {
  return (
    <header className="bg-white shadow p-4 flex flex-wrap items-center justify-start md:justify-between gap-4">
      {/* Mobile menu toggle */}
      <div className="lg:hidden">
        <button onClick={() => setOpen(!open)}>
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <div className="">
        <h1 className="text-xl md-text-2xl text-[#333333] font-semibold">
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
        <SearchIcon className="absolute top-1 opacity-60 w-5 h-5 left-1 text[#333333]" />
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
  );
};

export default Header;
