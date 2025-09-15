import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Restored useLocation
import axios from "axios";
import { toast } from "react-toastify";
import { ChevronDown, ArrowLeft } from "lucide-react";
import logo from "../assets/logo.png";
import { services, locations } from "../utils/formFields";

const BookService = () => {
  const [form, setForm] = useState({
    vehicle_id: "",
    vehicle_type: "",
    vehicle_make: "",
    vehicle_model: "",
    vin_number: "",
    service_required: "",
    service_center: "",
    year_of_manufacture: "",
    additional_services: [],
    service_date: "",
    service_time: "",
  });
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Pre-select vehicle from navigation state
  useEffect(() => {
    if (location.state?.selectedVehicleId) {
      setForm((prev) => ({
        ...prev,
        vehicle_id: location.state.selectedVehicleId.toString(),
      }));
    }
  }, [location.state]);

  // Fetch vehicles
  useEffect(() => {
    const fetchVehicles = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("Please log in to book a service.", {
          action: { label: "Log In", onClick: () => navigate("/signin") },
        });
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          "https://api.gapafix.com.ng/api/orders",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const fetchedVehicles = response.data.data || [];
        setVehicles(
          fetchedVehicles.map((v) => ({
            id: v.id || Date.now(),
            booking_id: v.booking_id || "N/A",
            vehicle_type: v.vehicle_type || "N/A",
            make: v.vehicle_make || "N/A",
            model: v.vehicle_model || "N/A",
            vin_number: v.vin_number || "N/A",
            full_name: v.full_name || "N/A",
            year: v.year_of_manufacture || "N/A",
            service_required: v.service_required || "N/A",
            service_center: v.service_center || "N/A",
            additional_services: v.additional_services || [],
            service_date: v.service_date || "N/A",
            service_time: v.service_time || "N/A",
            phone: v.phone || "N/A",
            email: v.email || "N/A",
            user_id: v.user_id || "N/A",
            status: v.status || "N/A",
            created_at: v.created_at || "N/A",
            updated_at: v.updated_at || "N/A",
            total_amount: v.total_amount || 0,
          }))
        );
      } catch (err) {
        console.error("Error fetching vehicles:", {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
        });
        if (err.response?.status === 401) {
          localStorage.removeItem("authToken");
          toast.error("Session expired. Please log in again.", {
            action: { label: "Log In", onClick: () => navigate("/signin") },
          });
        }
        // Silently handle errors
      } finally {
        setIsLoading(false);
      }
    };
    fetchVehicles();
  }, [navigate]);

  // Auto-fill vehicle details based on vehicle_id
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
        action: { label: "Log In", onClick: () => navigate("/signin") },
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
      setForm({
        vehicle_id: "",
        vehicle_type: "",
        vehicle_make: "",
        vehicle_model: "",
        vin_number: "",
        service_required: "",
        service_center: "",
        year_of_manufacture: "",
        additional_services: [],
        service_date: "",
        service_time: "",
      });
    } catch (err) {
      console.error("Error processing booking:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
      if (err.response?.status === 401) {
        localStorage.removeItem("authToken");
        toast.error("Session expired. Please log in again.", {
          action: { label: "Log In", onClick: () => navigate("/signin") },
        });
      } else {
        toast.error(
          err.response?.data?.message ||
            "Failed to process booking. Please try again."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-6 lg:px-20 md:px-16 sm:px-12 px-4">
      <header className="bg-[#F2F2F2] rounded-xl mb-3">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <img src={logo} alt="CarFlex Logo" className="h-12" />
              <h2 className="text-lg font-semibold text-[#575757]">
                Book Service
              </h2>
            </div>
            <button
              onClick={() => navigate("/vehicle-dashboard")}
              className="flex items-center space-x-2 text-[#492F92] hover:text-[#3b2371] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back to Dashboard</span>
            </button>
          </div>
        </div>
      </header>

      <div className="w-full max-w-2xl mx-auto py-8">
        {isLoading ? (
          <div className="text-center py-6">
            <p className="text-gray-500 text-sm">Loading vehicles...</p>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-500 text-sm">
              No vehicles available. Please add a vehicle first.
            </p>
            <button
              onClick={() => navigate("/vehicle-dashboard")}
              className="mt-4 bg-[#492F92] text-white px-4 py-2 rounded-full text-sm hover:bg-[#3b2371]"
            >
              Add Vehicle
            </button>
          </div>
        ) : (
          <div className="bg-[#F4F4F4] rounded-xl border border-[#EBEBEB] p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-[#575757] mb-4">
              Book a Service
            </h3>
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
                      className="w-full bg-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#492F92] transition-colors appearance-none"
                    >
                      <option value="">Select a vehicle</option>
                      {vehicles.map((vehicle) => (
                        <option key={vehicle.id} value={vehicle.id}>
                          {vehicle.vehicle_type} {vehicle.make} {vehicle.model}{" "}
                          · VIN: {vehicle.vin_number}
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
                    className="w-full bg-gray-200 rounded-md px-3 py-2 text-sm text-gray-500 cursor-not-allowed"
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
                    className="w-full bg-gray-200 rounded-md px-3 py-2 text-sm text-gray-500 cursor-not-allowed"
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
                    className="w-full bg-gray-200 rounded-md px-3 py-2 text-sm text-gray-500 cursor-not-allowed"
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
                    className="w-full bg-gray-200 rounded-md px-3 py-2 text-sm text-gray-500 cursor-not-allowed"
                    placeholder="Enter your 17-character VIN"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Year of Manufacture
                  </label>
                  <div className="relative">
                    <select
                      name="year_of_manufacture"
                      value={form.year_of_manufacture}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="w-full bg-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#492F92] transition-colors appearance-none"
                    >
                      <option value="">Select a year</option>
                      {Array.from(
                        { length: 2025 - 1980 + 1 },
                        (_, i) => 2025 - i
                      ).map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
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
                      className="w-full bg-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#492F92] transition-colors appearance-none"
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
                      className="w-full bg-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#492F92] transition-colors appearance-none"
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
                    className="w-full bg-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#492F92] transition-colors"
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
                    className="w-full bg-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#492F92] transition-colors"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Services
                  </label>
                  <div className="space-y-2">
                    {services.map((service, index) => (
                      <label
                        key={index}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          name="additional_services"
                          value={service}
                          checked={form.additional_services.includes(service)}
                          onChange={handleChange}
                          disabled={isSubmitting}
                          className="h-4 w-4 text-[#492F92] focus:ring-[#492F92]"
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
                className={`w-full bg-[#492F92] text-white py-2 rounded-full text-sm font-medium hover:bg-[#3b2371] transition-colors ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Submitting..." : "Book Service"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookService;
