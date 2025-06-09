import React from "react";
import { Link } from "react-router-dom";
// import logo from '../assets/logo.png';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center px-4">
      {/* <img src={logo} alt="Company logo" className="w-32 h-32 mb-6" /> */}
      <h1 className="text-4xl sm:text-5xl font-bold text-[#492F92] mb-4">
        404 - Page Not Found
      </h1>
      <p className="text-lg sm:text-xl text-gray-600 mb-8">
        Oops! The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="bg-[#492F92] text-white py-3 px-6 rounded hover:bg-[#3b2371] transition duration-300 text-base font-medium shadow-md"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
