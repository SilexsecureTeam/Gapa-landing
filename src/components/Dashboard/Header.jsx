import React, { useState, useEffect, useRef } from "react";
import { BellIcon, MailIcon, SearchIcon, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { debounce } from "lodash";
import logo from "../../assets/logo.png";
import profile from "../../assets/Profile.png";
import { toast } from "react-toastify";

const Header = ({ open, setOpen }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef(null);

  // Determine the logo's destination based on authentication and role
  const getLogoDestination = () => {
    if (!user) {
      return "/signin";
    }
    return user.role === "admin" ? "/dashboard" : "/vehicle-dashboard";
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    const destination = getLogoDestination();
    navigate(destination);
  };

  // Debounced search function
  const fetchSearchResults = debounce(async (query) => {
    if (!query || user?.role !== "admin") {
      setSearchResults([]);
      setIsSearchOpen(false);
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      setSearchResults([]);
      setIsSearchOpen(false);
      toast.error("Please sign in to use search.", {
        position: "top-right",
        autoClose: 2000,
      });
      navigate("/signin", { state: { from: window.location.pathname } });
      return;
    }

    try {
      const response = await axios.get(
        "https://api.gapafix.com.ng/api/bookings/all",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.status) {
        const bookings = response.data.data.filter((booking) =>
          booking.booking_id
            ?.toString()
            .toLowerCase()
            .includes(query.toLowerCase())
        );
        setSearchResults(bookings);
        setIsSearchOpen(bookings.length > 0);
      } else {
        setSearchResults([]);
        setIsSearchOpen(false);
      }
    } catch (err) {
      console.error(
        "Error fetching search results:",
        err.message,
        err.response?.data
      );
      setSearchResults([]);
      setIsSearchOpen(false);
      if (err.response?.status === 401) {
        toast.error("Session expired. Please sign in again.", {
          position: "top-right",
          autoClose: 2000,
        });
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        navigate("/signin", { state: { from: window.location.pathname } });
      }
    }
  }, 300);

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (user?.role === "admin") {
      fetchSearchResults(query);
    } else {
      setSearchResults([]);
      setIsSearchOpen(false);
    }
  };

  // Handle search result selection
  const handleResultClick = (booking) => {
    setSearchQuery("");
    setSearchResults([]);
    setIsSearchOpen(false);
    navigate(`/dashboard/quote/${encodeURIComponent(booking.booking_id)}`, {
      state: { ...booking },
    });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
              Welcome, {user?.name || "Guest"}!
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

        {/* Row 2: Search */}
        <div className="flex justify-center" ref={searchRef}>
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder={
                user?.role === "admin"
                  ? "Search fleet name..."
                  : "Search disabled for non-admins"
              }
              className="bg-[#F5F5F5] rounded-md outline-none px-2 pl-6 py-0.5 w-full text-sm"
              value={searchQuery}
              onChange={handleSearchChange}
              disabled={user?.role !== "admin"}
            />
            <SearchIcon className="absolute top-0.5 left-1 opacity-60 w-4 h-4 text-[#333333]" />
            {isSearchOpen && user?.role === "admin" && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {searchResults.length > 0 ? (
                  searchResults.map((booking) => (
                    <div
                      key={booking.id}
                      className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleResultClick(booking)}
                    >
                      {booking.booking_id}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-sm text-gray-400">
                    No results found
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Row 3: Logo, Button */}
        <div className="flex flex-wrap justify-between items-center gap-2">
          <a href={getLogoDestination()} onClick={handleLogoClick}>
            <img src={logo} alt="CarFlex Logo" className="h-10" />
          </a>
          <button className="text-white bg-[#4B3193] px-2 py-1 rounded-lg text-xs font-medium">
            Schedule Maintenance
          </button>
        </div>
      </header>

      {/* Tablet Header (sm to <lg, single header with flex-wrap) */}
      <header className=" sm:flex lg:hidden bg-white px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-4">
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
              Welcome, {user?.name || "Guest"}!
            </h1>
            <p className="text-[#747681] font-light text-sm">
              Let’s check your Garage today
            </p>
          </div>
        </div>

        {/* Center: Logo */}
        <div className="flex items-center">
          <a href={getLogoDestination()} onClick={handleLogoClick}>
            <img src={logo} alt="CarFlex Logo" className="h-10" />
          </a>
        </div>

        {/* Right: Search, Notifications, Profile, Button */}
        <div className="flex items-center gap-4 flex-wrap" ref={searchRef}>
          <div className="relative w-full sm:w-40 max-w-xs">
            <input
              type="text"
              placeholder={
                user?.role === "admin"
                  ? "Search fleet name..."
                  : "Search disabled for non-admins"
              }
              className="bg-[#F5F5F5] rounded-md outline-none px-3 pl-7 py-1 w-full"
              value={searchQuery}
              onChange={handleSearchChange}
              disabled={user?.role !== "admin"}
            />
            <SearchIcon className="absolute top-1 left-1 opacity-60 w-5 h-5 text-[#333333]" />
            {isSearchOpen && user?.role === "admin" && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {searchResults.length > 0 ? (
                  searchResults.map((booking) => (
                    <div
                      key={booking.id}
                      className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleResultClick(booking)}
                    >
                      {booking.booking_id}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-sm text-gray-400">
                    No results found
                  </div>
                )}
              </div>
            )}
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
              Welcome, {user?.name || "Guest"}!
            </h1>
            <p className="text-[#747681] font-light text-sm">
              Let’s check your Garage today
            </p>
          </div>
          <div
            className="relative md:w-[30%] flex-grow max-w-[180px] md:max-w-xs"
            ref={searchRef}
          >
            <input
              type="text"
              placeholder={
                user?.role === "admin"
                  ? "Search fleet name..."
                  : "Search disabled for non-admins"
              }
              className="bg-[#F5F5F5] rounded-md outline-none px-3 pl-7 py-1 w-full"
              value={searchQuery}
              onChange={handleSearchChange}
              disabled={user?.role !== "admin"}
            />
            <SearchIcon className="absolute top-1 opacity-60 w-5 h-5 left-1 text-[#333333]" />
            {isSearchOpen && user?.role === "admin" && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {searchResults.length > 0 ? (
                  searchResults.map((booking) => (
                    <div
                      key={booking.id}
                      className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleResultClick(booking)}
                    >
                      {booking.booking_id}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-sm text-gray-400">
                    No results found
                  </div>
                )}
              </div>
            )}
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
                <a href={getLogoDestination()} onClick={handleLogoClick}>
                  <img src={logo} alt="CarFlex Logo" className="h-10" />
                </a>
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
