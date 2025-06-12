import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Added for navigation
import auth from "../assets/auth.png";

// Google SVG Icon (inline for demo)
const GoogleIcon = () => (
  <svg
    className="w-12 h-12 p-2 border border-gray-300 rounded-full"
    viewBox="0 0 48 48"
  >
    <g>
      <path
        fill="#4285F4"
        d="M44.5 20H24v8.5h11.7C34.5 32.5 29.8 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.1 8.1 3l6.6-6.6C34.1 5.2 29.3 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 19.4-7.7 20.7-17.7.1-.7.3-1.5.3-2.3 0-1.2-.1-2.3-.3-3.3z"
      />
      <path
        fill="#34A853"
        d="M6.3 14.7l7 5.1C15.5 16.1 19.4 13 24 13c3.1 0 5.9 1.1 8.1 3l6.6-6.6C34.1 5.2 29.3 3 24 3 16.3 3 9.4 7.7 6.3 14.7z"
      />
      <path
        fill="#FBBC05"
        d="M24 45c5.3 0 10.1-1.8 13.8-4.9l-6.4-5.2C29.2 36.7 26.7 37.5 24 37.5c-5.7 0-10.5-3.7-12.2-8.8l-7 5.4C9.3 41.3 16.1 45 24 45z"
      />
      <path
        fill="#EA4335"
        d="M44.5 20H24v8.5h11.7c-1.1 3.1-4.1 5.5-7.7 5.5-2.2 0-4.2-.7-5.7-2l-7 5.4C15.5 43.9 19.4 47 24 47c5.3 0 10.1-1.8 13.8-4.9l-6.4-5.2C29.2 36.7 26.7 37.5 24 37.5c-5.7 0-10.5-3.7-12.2-8.8l-7 5.4C9.3 41.3 16.1 45 24 45z"
      />
    </g>
  </svg>
);

// Apple SVG Icon (inline for demo)
const AppleIcon = () => (
  <svg
    className="w-12 h-12 p-2 border border-gray-300 rounded-full"
    viewBox="0 0 24 24"
  >
    <g>
      <path
        fill="currentColor"
        d="M16.7,1.7c0,1-0.4,2-1.1,2.7c-0.7,0.8-1.8,1.3-2.8,1.2c-0.1-1,0.4-2,1.1-2.7C14.6,1.2,15.7,0.7,16.7,1.7z M21.1,17.2
        c-0.3,0.7-0.6,1.4-1,2.1c-0.5,0.8-1,1.6-1.7,2.3c-0.7,0.7-1.5,1.1-2.4,1.1c-0.7,0-1.5-0.2-2.4-0.7c-0.9-0.5-1.8-0.7-2.7-0.7
        c-0.9,0-1.8,0.2-2.7,0.7c-0.9,0.5-1.7,0.7-2.4,0.7c-0.9,0-1.7-0.4-2.4-1.1c-0.7-0.7-1.3-1.5-1.7-2.3c-0.4-0.7-0.7-1.4-1-2.1
        c-0.6-1.4-0.9-2.8-0.9-4.1c0-1.7,0.4-3.1,1.3-4.2c0.9-1.1,2.1-1.7,3.7-1.7c0.7,0,1.5,0.2,2.3,0.6c0.8,0.4,1.4,0.6,1.7,0.6
        c0.3,0,0.9-0.2,1.7-0.6c0.8-0.4,1.6-0.6,2.3-0.6c1.6,0,2.8,0.6,3.7,1.7c0.9,1.1,1.3,2.5,1.3,4.2C22,14.4,21.7,15.8,21.1,17.2z"
      />
    </g>
  </svg>
);

const roles = ["User", "Mechanic", "Admin"];

const SignUp = () => {
  const [form, setForm] = useState({
    email: "",
    phone: "",
    role: "",
    agree: false,
  });
  const navigate = useNavigate(); // Added for navigation

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.agree) {
      alert("Please agree to the Terms and Conditions and Privacy Policy.");
      return;
    }
    // Submit logic here
    alert(JSON.stringify(form, null, 2));
    navigate("/signin"); // Navigate to sign-in page after submission
  };

  return (
    <div className="min-h-screen py-8 md:py-12 px-4 sm:px-8 md:px-16 lg:px-20">
      <div className="flex w-full max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Left: Form */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-12 lg:p-16 flex flex-col justify-center">
          <h2 className="text-xl sm:text-2xl text-[#333333] font-bold mb-6 text-center">
            Create an account for free
          </h2>
          <div className="flex justify-center space-x-4 sm:space-x-6 w-full mb-4">
            <button className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 transition-transform hover:scale-105">
              <GoogleIcon />
            </button>
            <button className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 transition-transform hover:scale-105">
              <AppleIcon />
            </button>
          </div>
          {/* OR Divider */}
          <div className="flex w-[80%] mx-auto items-center my-4">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-2 text-gray-400 text-sm">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          {/* Controlled Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-base font-semibold text-[#333333] mb-1">
                Your email*
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full bg-[#F2F2F2] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                placeholder="Please enter your email"
              />
            </div>
            <div>
              <label className="block text-base font-semibold text-[#333333] mb-1">
                Phone number*
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                className="w-full bg-[#F2F2F2] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                placeholder="Phone number"
              />
            </div>
            <div>
              <label className="block text-base font-semibold text-[#333333] mb-1">
                Select your role*
              </label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                required
                className="w-full bg-[#F2F2F2] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              >
                <option value="">Please select your role</option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
            {/* Checkbox */}
            <div className="flex items-start space-x-2 text-xs text-gray-500 mb-2">
              <input
                type="checkbox"
                name="agree"
                checked={form.agree}
                onChange={handleChange}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label>
                By creating an account, you are agreeing to the{" "}
                <a href="#" className="underline hover:text-indigo-600">
                  Terms and Conditions
                </a>{" "}
                and{" "}
                <a href="#" className="underline hover:text-indigo-600">
                  Privacy Policy
                </a>
                .
              </label>
            </div>
            <button
              type="submit"
              className="w-full bg-[#492F92] mt-3 text-white py-2 rounded-md hover:bg-indigo-700 font-semibold transition-colors"
            >
              SIGN UP
            </button>
          </form>
          <div className="mt-4 text-sm text-center">
            Already have an account?{" "}
            <a
              href="/signin"
              className="text-[#492F92] font-medium hover:underline"
            >
              Login
            </a>
          </div>
        </div>
        {/* Right: Image */}
        <div className="hidden md:block md:w-1/2">
          <img
            src={auth}
            alt="Signup Visual"
            className="object-cover h-180 w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default SignUp;
