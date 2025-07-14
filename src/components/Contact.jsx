import React, { useState } from "react";
import { MapPin, Phone, User, Mail, MessageSquare } from "lucide-react";
import contact from "../assets/contact1.png";

const Contact = () => {
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
      console.log("Form submitted:", formData);
      alert(
        "Thank you! Your appointment request has been submitted successfully."
      );

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: "",
      });
      setErrors({});
    } catch (error) {
      console.error("Submission error:", error);
      alert(
        "Sorry, there was an error submitting your request. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-12 md:py-16 lg:px-10 md:px-8 sm:px-6 px-2">
      <div className="flex flex-col md:flex-row w-full mx-auto">
        {/* Left Container */}
        <div className="w-full md:w-1/2 rounded-b-lg md:rounded-r-lg md:rounded-bl-none overflow-hidden flex flex-col justify-between pr-6 md:pr-8 lg:pr-12">
          <div>
            <h1 className="text-[#492F92] text-2xl md:text-3xl uppercase leading-tight md:text-start text-center font-bold mb-2 md:mb-4">
              Connect with GAPA Fix for Trusted Auto Care
            </h1>
            <p className="text-[#333333] text-base font-normal sm:text-lg md:text-lg">
              Ready to fix your car with genuine auto spare parts and expert
              service? GAPA Fix’s Lagos team is here to deliver fast, reliable
              solutions tailored to you. Reach out to schedule your appointment
              or learn more about our services
            </p>
            <h2 className="text-[#333333] md:text-xl text-lg mt-4 font-medium">
              Our Office
            </h2>
            <img
              src={contact}
              alt="GAPA Fix office"
              className="mt-2 w-full h-58 md:w-fit"
            />
            <p className="text-[#333333] text-base font-normal mt-2 sm:text-lg">
              <span className="font-bold">Book Your Appointment:</span> Fill out
              our Contact Form or call us now. Follow us on{" "}
              <a
                href="https://x.com"
                className="text-[#492F92] hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                X
              </a>{" "}
              or{" "}
              <a
                href="https://instagram.com"
                className="text-[#492F92] hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>{" "}
              for maintenance tips and exclusive offers!
            </p>
          </div>
          {/* Address and Phone Number */}
          <div className="mt-4">
            <h2 className="text-[#333333] md:text-2xl text-lg font-medium">
              Ikoyi, Lagos, Nigeria
            </h2>
            <div className="flex gap-4 mt-2">
              <div className="flex flex-col gap-2">
                <div className="flex items-start gap-2">
                  <MapPin className="text-[#D5AB16] w-5 h-5" />
                  <p className="text-[#333333] text-base sm:text-lg">
                    Giwa Barracks Car Park, Ikoyi, Lagos, Nigeria
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="text-[#D5AB16] w-5 h-5" />
                  <p className="text-[#333333] text-base sm:text-lg">
                    (234) 701 888 8307
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Mail className="text-[#D5AB16] w-5 h-5" />
                  <p className="text-[#333333] text-base sm:text-lg">
                    support@gapafix.com.ng
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <p className="text-[#333333] text-base sm:text-lg">
                    <strong>Hours:</strong> Mon-Fri: 8 AM - 6 PM | Sat: 9 AM - 4
                    PM | Sun: Closed
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Container (Form) */}
        <div className="w-full md:w-1/2 p-6 md:p-8 lg:p-12 border mt-6 md:mt-0 h-fit border-[#3333334D] rounded-t-lg md:rounded-l-lg md:rounded-tr-none flex flex-col justify-between">
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
                        : "border-gray-300 focus:ring-[#492F92]"
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
                        : "border-gray-300 focus:ring-[#492F92]"
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
                      : "border-gray-300 focus:ring-[#492F92]"
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
                      : "border-gray-300 focus:ring-[#492F92]"
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
                  rows="6"
                  className={`w-full pl-12 md:h-60 pr-4 py-3 rounded-lg border ${
                    errors.message
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-[#492F92]"
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
              className={`bg-[#492F92] w-full cursor-pointer text-white font-semibold py-3 md:py-4 px-4 rounded-lg transition-all duration-300 ease-in-out transform focus:outline-none focus:ring-2 focus:ring-[#492F92] focus:ring-opacity-50 text-sm md:text-base lg:text-lg ${
                isSubmitting
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:bg-[#492F92]/90 hover:scale-[1.02] hover:shadow-lg"
              }`}
            >
              {isSubmitting ? "Booking Appointment..." : "Book an Appointment"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
