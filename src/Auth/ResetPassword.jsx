import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import auth from "../assets/auth.png";
import logo from "../assets/logo.png";

const ResetPassword = () => {
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Extract token and email from URL query parameters
  const query = new URLSearchParams(location.search);
  const token = query.get("token");
  const email = query.get("email");

  useEffect(() => {
    if (!token || !email) {
      toast.error("Invalid or missing reset link. Please request a new one.");
      navigate("/forgot-password");
    }
  }, [token, email, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.password || !form.confirmPassword) {
      toast.error("Please fill in both password fields.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post(
        "https://api.gapafix.com.ng/api/reset-password",
        { email, password: form.password, token },
        { headers: { "Content-Type": "application/json" } }
      );
      toast.success("Password reset successfully!");
      navigate("/signin");
    } catch (error) {
      console.error("Reset password error:", error);
      let errorMessage = "Failed to reset password. Please try again.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 401) {
        errorMessage =
          "Invalid or expired token. Please request a new reset link.";
      }
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-8 md:px-16 lg:px-20">
      <div className="flex justify-end mb-4">
        <img src={logo} alt="Logo" className="w-20" />
      </div>
      <div className="flex w-full max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-12 lg:px-16 flex flex-col justify-center">
          <h2 className="text-xl sm:text-2xl text-[#3D3D3D] font-bold text-center mb-8">
            Reset Password
          </h2>
          <p className="text-sm text-gray-500 text-center mb-6">
            Enter your new password below.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-base font-semibold text-[#333333] mb-1">
                New Password<span className="text-[#FF0000]">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                className="w-full bg-[#F2F2F2] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                placeholder="Enter your new password"
              />
            </div>
            <div>
              <label className="block text-base font-semibold text-[#333333] mb-1">
                Confirm Password<span className="text-[#FF0000]">*</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                className="w-full bg-[#F2F2F2] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                placeholder="Confirm your new password"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-[#492F92] mt-3 text-white py-2 rounded-md font-semibold transition-colors ${
                isSubmitting
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-[#3b2371]"
              }`}
            >
              {isSubmitting ? "Resetting..." : "Reset Password"}
            </button>
          </form>
          <div className="mt-4 text-sm text-center">
            Back to{" "}
            <Link
              to="/signin"
              className="text-[#492F92] font-medium hover:underline"
            >
              Sign In
            </Link>
          </div>
        </div>
        <div className="hidden md:block md:w-1/2">
          <img
            src={auth}
            alt="Reset Password Visual"
            className="object-cover h-135 w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
