import React, { useState } from "react";
import { User, Mail, Phone, MessageSquare } from "lucide-react";
import car from "../assets/talk.png";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Car = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[+]?[\d\s()-]{7,16}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success("Form submitted successfully!");

      navigate("/suc", {
        state: formData,
      });

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: "",
      });
      setErrors({});
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Try again.");
    }
  };

  return (
    <section className="bg-[#f3f1f7] py-8 md:py-12 lg:py-16 lg:px-20 md:px-16 sm:px-12 px-4">
      <div className="flex flex-col md:flex-row w-full mx-auto bg-[#f3f1f7]">
        <div className="w-full md:w-1/2 p-6 md:p-8 lg:p-12 bg-[#492F92] rounded-t-lg md:rounded-l-lg md:rounded-tr-none">
          <h1 className="text-[#E5E5E5] font-bold text-xl md:text-2xl mb-2 leading-tight">
            Let's Talk About Your Car
          </h1>
          <h1 className="text-[#E5E5E5] font-light md:text-lg text-base mb-6 md:mb-8 leading-tight">
            Fill out the form and we'll get back to you as soon as possible.
          </h1>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="First Name"
                    className={`w-full pl-12 pr-4 py-3 rounded-lg border ${
                      errors.firstName
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-[#F7CD3A]"
                    } focus:border-transparent focus:outline-none focus:ring-2 bg-[#E5E5E5] border-0 focus:ring-opacity-50 text-gray-900 placeholder-gray-500`}
                  />
                </div>
                {errors.firstName && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div className="flex-1">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last Name"
                    className={`w-full pl-12 pr-4 py-3 rounded-lg border ${
                      errors.lastName
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-[#F7CD3A]"
                    } focus:border-transparent focus:outline-none focus:ring-2 bg-[#E5E5E5] border-0 focus:ring-opacity-50 text-gray-900 placeholder-gray-500`}
                  />
                </div>
                {errors.lastName && (
                  <p className="text-red-400 text-sm mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  className={`w-full pl-12 pr-4 py-3 rounded-lg border ${
                    errors.email
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-[#F7CD3A]"
                  } focus:border-transparent focus:outline-none focus:ring-2 bg-[#E5E5E5] border-0 focus:ring-opacity-50 text-gray-900 placeholder-gray-500`}
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className={`w-full pl-12 pr-4 py-3 rounded-lg border ${
                    errors.phone
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-[#F7CD3A]"
                  } focus:border-transparent focus:outline-none focus:ring-2 bg-[#E5E5E5] border-0 focus:ring-opacity-50 text-gray-900 placeholder-gray-500`}
                />
              </div>
              {errors.phone && (
                <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Message */}
            <div>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-4 text-gray-400 w-5 h-5" />
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your car and what service you need..."
                  rows="4"
                  className={`w-full pl-12 pr-4 py-3 rounded-lg border ${
                    errors.message
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-[#F7CD3A]"
                  } focus:border-transparent focus:outline-none focus:ring-2 bg-[#E5E5E5] border-0 focus:ring-opacity-50 text-gray-900 placeholder-gray-500 resize-none`}
                />
              </div>
              {errors.message && (
                <p className="text-red-400 text-sm mt-1">{errors.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-[#F7CD3A] w-full cursor-pointer text-[#492F92] font-semibold py-3 md:py-4 px-4 rounded-lg transition-all duration-300 ease-in-out transform focus:outline-none focus:ring-2 focus:ring-[#F7CD3A] focus:ring-opacity-50 text-sm md:text-base lg:text-lg ${
                isSubmitting
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:bg-[#F7CD3A]/90 hover:scale-[1.02] hover:shadow-lg"
              }`}
            >
              {isSubmitting ? "Booking Appointment..." : "Book an Appointment"}
            </button>
          </form>
        </div>

        <div className="relative w-full md:w-1/2 rounded-b-lg md:rounded-r-lg md:rounded-bl-none overflow-hidden">
          <img src={car} alt="trust" className="w-full h-full object-cover" />
          <div className="absolute bg-black/40 opacity-50 w-full h-full inset-0"></div>
        </div>
      </div>
    </section>
  );
};

export default Car;
