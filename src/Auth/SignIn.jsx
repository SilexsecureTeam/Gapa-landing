import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import auth from "../assets/auth.png";

const SignIn = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error("Please fill in both email and password.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        "https://api.gapafix.com.ng/api/login",
        {
          email: form.email,
          password: form.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { token, user } = response.data;
      localStorage.setItem("authToken", token);
      toast.success("Login successful!");

      // Redirect based on user role
      const role = user.role || "user"; // Assume "user" if role is undefined
      const redirectPath =
        role === "admin" ? "/admin-dashboard" : "/vehicle-dashboard";
      navigate(redirectPath, { state: { user } });
    } catch (error) {
      console.error("Login error:", error);
      let errorMessage = "Failed to sign in. Please try again.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 401) {
        errorMessage = "Invalid email or password.";
      }
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-8 md:px-16 lg:px-20">
      <div className="flex w-full max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-12 lg:px-16 flex flex-col justify-center">
          <h2 className="text-xl sm:text-2xl text-[#3D3D3D] font-bold text-center mb-8">
            Sign In
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-base font-semibold text-[#333333] mb-1">
                Your email<span className="text-[#FF0000]">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                className="w-full bg-[#F2F2F2] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                placeholder="Please enter your email"
              />
            </div>
            <div>
              <label className="block text-base font-semibold text-[#333333] mb-1">
                Password<span className="text-[#FF0000]">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                className="w-full bg-[#F2F2F2] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                placeholder="Enter your password"
              />
            </div>
            <div className="text-sm text-right">
              <Link
                to="/forgot-password"
                className="text-[#492F92] font-medium hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-[#492F92] mt-3 text-white py-2 rounded-md font-semibold transition-colors ${
                isSubmitting
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-indigo-700"
              }`}
            >
              {isSubmitting ? "Signing In..." : "SIGN IN"}
            </button>
          </form>
        </div>
        <div className="hidden md:block md:w-1/2">
          <img
            src={auth}
            alt="Signin Visual"
            className="object-cover h-135 w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default SignIn;
