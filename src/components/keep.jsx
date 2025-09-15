// SEO Title:
// GAPA Fix | Expert Car Repairs & Genuine Auto Spare Parts in Lagos

// Meta Description:
// Discover GAPA Fix – your trusted destination in Lagos for professional car repairs, maintenance, and authentic auto spare parts. Quality service, genuine parts, and reliable support to keep your vehicle running smoothly

// SEO Title:
// About Us | GAPA Fix – Car Repairs & Genuine Auto Spare Parts in Lagos

// Meta Description:
// Learn more about GAPA Fix, Lagos’s premier destination for expert car repairs and authentic auto spare parts. Discover our mission, values, and commitment to keeping your vehicle safe and reliable

// SEO Title:
// Services | GAPA Fix – Auto Repairs & Genuine Spare Parts in Lagos

// Meta Description:
// Explore GAPA Fix’s full suite of auto repair and maintenance services in Lagos. From oil service, brake system repairs, diagnostics, engine checks, wheel alignment, suspension, tyre change, detailing, paint & bodywork – all with genuine spare parts and advanced part-matching technology

// SEO Title:
// Contact Us | GAPA Fix – Connect for Trusted Auto Care in Lagos

// Meta Description:
// Get in touch with GAPA Fix today for expert car repairs and genuine auto spare parts in Lagos. Our team is ready to provide trusted auto care, professional support, and reliable service for all your vehicle needs

import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { services, locations } from "../utils/formFields";

const BookService = ({ isOpen, onClose, vehicles }) => {
  const [form, setForm] = useState({
    vehicle_id: "",
    vehicle_type: "",
    vehicle_make: "",
    vehicle_model: "",
    vin_number: "",
    // full_name: "",
    service_required: "",
    service_center: "",
    year_of_manufacture: "",
    additional_services: [],
    service_date: "",
    service_time: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (form.vehicle_id) {
      const selectedVehicle = vehicles.find(
        (v) => v.id.toString() === form.vehicle_id
      );
      if (selectedVehicle) {
        setForm((prev) => ({
          ...prev,
          vehicle_type: selectedVehicle.vehicle_type || "",
          vehicle_make: selectedVehicle.make || "",
          vehicle_model: selectedVehicle.model || "",
          vin_number: selectedVehicle.vin_number || "",
          year_of_manufacture: selectedVehicle.year || "",
        }));
      }
    } else {
      setForm((prev) => ({
        ...prev,
        vehicle_type: "",
        vehicle_make: "",
        vehicle_model: "",
        vin_number: "",
        year_of_manufacture: "",
      }));
    }
  }, [form.vehicle_id, vehicles]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setForm((prev) => ({
        ...prev,
        additional_services: checked
          ? [...prev.additional_services, value]
          : prev.additional_services.filter((s) => s !== value),
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ...unchanged imports

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !form.vehicle_id ||
      !form.vehicle_type ||
      !form.vehicle_make ||
      !form.vehicle_model ||
      !form.vin_number ||
      !form.service_required ||
      !form.service_center ||
      !form.service_date ||
      !form.service_time
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Please log in to book a service.", {
        action: {
          label: "Log In",
          onClick: () => navigate("/signin"),
        },
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const selectedVehicle = vehicles.find(
        (v) => v.id.toString() === form.vehicle_id
      );
      const payload = {
        vehicle_type: form.vehicle_type,
        vehicle_make: form.vehicle_make,
        vehicle_model: form.vehicle_model,
        vin_number: form.vin_number,
        full_name: form.full_name,
        service_required: form.service_required,
        service_center: form.service_center,
        year_of_manufacture: form.year_of_manufacture || null,
        additional_services: form.additional_services,
        service_date: form.service_date,
        service_time: form.service_time,
      };
      let response;
      if (selectedVehicle?.id) {
        response = await axios.patch(
          `https://api.gapafix.com.ng/api/bookings/${selectedVehicle.id}`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        response = await axios.post(
          "https://api.gapafix.com.ng/api/bookings/start",
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
      const bookingId = response.data?.id || selectedVehicle?.id;
      navigate("/vehicle-dashboard", {
        state: {
          trustData: {
            vehicle: `${form.vehicle_type} ${form.vehicle_make} ${form.vehicle_model}`,
            service: form.service_required,
            location: form.service_center,
            bookingId,
          },
        },
      });
      toast.success("Booking updated successfully!");
      onClose();
      setForm({
        vehicle_id: "",
        vehicle_type: "",
        vehicle_make: "",
        vehicle_model: "",
        vin_number: "",
        full_name: "",
        service_required: "",
        service_center: "",
        year_of_manufacture: "",
        additional_services: [],
        service_date: "",
        service_time: "",
      });
    } catch (err) {
      console.error("Error processing booking", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("authToken");
        toast.error("Session expired. Please log in again.", {
          action: {
            label: "Log In",
            onClick: () => navigate("/signin"),
          },
        });
      } else {
        toast.error("Failed to process booking. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black/40 z-50 overflow-y-auto transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="bg-white w-full max-w-xl rounded-xl shadow-lg p-6 sm:max-w-lg mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Book Service</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black text-lg"
          >
            ×
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-6">
          Select a vehicle and service to book
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Vehicle<span className="text-[#FF0000]">*</span>
              </label>
              <div className="relative">
                <select
                  name="vehicle_id"
                  value={form.vehicle_id}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className="w-full bg-[#F2F2F2] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors appearance-none"
                >
                  <option value="">Select a vehicle</option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.vehicle_type} {vehicle.make} {vehicle.model} ·
                      VIN: {vehicle.vin_number}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle Type<span className="text-[#FF0000]">*</span>
              </label>
              <input
                type="text"
                name="vehicle_type"
                value={form.vehicle_type}
                onChange={handleChange}
                required
                disabled
                className="w-full bg-[#F2F2F2] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle Make<span className="text-[#FF0000]">*</span>
              </label>
              <input
                type="text"
                name="vehicle_make"
                value={form.vehicle_make}
                onChange={handleChange}
                required
                disabled
                className="w-full bg-[#F2F2F2] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle Model<span className="text-[#FF0000]">*</span>
              </label>
              <input
                type="text"
                name="vehicle_model"
                value={form.vehicle_model}
                onChange={handleChange}
                required
                disabled
                className="w-full bg-[#F2F2F2] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                VIN Number<span className="text-[#FF0000]">*</span>
              </label>
              <input
                type="text"
                name="vin_number"
                value={form.vin_number}
                onChange={handleChange}
                required
                disabled
                className="w-full bg-[#F2F2F2] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors opacity-50"
                placeholder="Enter your 17-character VIN"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year of Manufacture
              </label>
              <input
                type="text"
                name="year_of_manufacture"
                value={form.year_of_manufacture}
                onChange={handleChange}
                disabled
                className="w-full bg-[#F2F2F2] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Service<span className="text-[#FF0000]">*</span>
              </label>
              <div className="relative">
                <select
                  name="service_required"
                  value={form.service_required}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className="w-full bg-[#F2F2F2] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors appearance-none"
                >
                  <option value="">Select a service</option>
                  {services.map((service, index) => (
                    <option key={index} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Location<span className="text-[#FF0000]">*</span>
              </label>
              <div className="relative">
                <select
                  name="service_center"
                  value={form.service_center}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className="w-full bg-[#F2F2F2] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors appearance-none"
                >
                  <option value="">Select a location</option>
                  {locations.map((location, index) => (
                    <option key={index} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Service Date<span className="text-[#FF0000]">*</span>
              </label>
              <input
                type="date"
                name="service_date"
                value={form.service_date}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                className="w-full bg-[#F2F2F2] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Service Time<span className="text-[#FF0000]">*</span>
              </label>
              <input
                type="time"
                name="service_time"
                value={form.service_time}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                className="w-full bg-[#F2F2F2] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Services
              </label>
              <div className="space-y-2">
                {services.map((service, index) => (
                  <label key={index} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="additional_services"
                      value={service}
                      checked={form.additional_services.includes(service)}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700">{service}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-[#492F92] text-white py-2 rounded-md text-sm font-medium hover:bg-[#3b2371] transition-colors ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Submitting..." : "Book Service"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookService;
