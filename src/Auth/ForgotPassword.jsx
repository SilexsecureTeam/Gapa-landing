import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import auth from "../assets/auth.png";
// import logo from "../assets/logo.png";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email.");
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post(
        "https://api.gapafix.com.ng/api/forgot-password",
        { email },
        { headers: { "Content-Type": "application/json" } }
      );
      toast.success("Reset link sent to your email!");
      navigate("/signin");
    } catch (error) {
      console.error("Forgot password error:", error);
      let errorMessage = "Failed to send reset link. Please try again.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 404) {
        errorMessage = "Email not found.";
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
            Forgot Password
          </h2>
          <p className="text-sm text-gray-500 text-center mb-6">
            Enter your email to receive a password reset link.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-base font-semibold text-[#333333] mb-1">
                Your email<span className="text-[#FF0000]">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
                className="w-full bg-[#F2F2F2] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                placeholder="Please enter your email"
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
              {isSubmitting ? "Sending..." : "Send Reset Link"}
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
            alt="Forgot Password Visual"
            className="object-cover h-135 w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
