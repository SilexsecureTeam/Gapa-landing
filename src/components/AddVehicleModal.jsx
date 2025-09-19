import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { services, locations } from "../utils/formFields";

const AddVehicleModal = ({ isOpen, onClose, setVehicles }) => {
  const [form, setForm] = useState({
    vehicle_type: "",
    vehicle_make: "",
    vehicle_model: "",
    vin_number: "",
    full_name: "",
    year_of_manufacture: "",
    service_required: "",
    service_center: "",
    additional_services: [],
    service_date: "",
    service_time: "",
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [submodels, setSubmodels] = useState([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [loadingSubModels, setLoadingSubModels] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const isValidVIN = (vin) =>
    /^[A-HJ-NPR-Z0-9]{17}$/i.test(vin) && vin.length === 17;

  useEffect(() => {
    axios
      .get("https://stockmgt.gapaautoparts.com/api/brand/all-brand")
      .then((res) => {
        const raw = res.data?.brands ?? [];
        const normalized = raw.map((b) =>
          typeof b === "string" ? { name: b, id: b } : b
        );
        setBrands(normalized);
      })
      .catch((err) => {
        console.error("Error fetching brands", err);
        setBrands([
          { name: "Toyota", id: "1" },
          { name: "Honda", id: "2" },
          { name: "Ford", id: "3" },
        ]);
        toast.error("Failed to fetch brands. Using fallback data.");
      });
  }, []);

  useEffect(() => {
    if (form.vehicle_type) {
      const selectedBrand = brands.find((b) => b.name === form.vehicle_type);
      if (selectedBrand?.id) {
        setLoadingModels(true);
        axios
          .get(
            `https://stockmgt.gapaautoparts.com/api/getModelByBrandId?brand_id=${selectedBrand.id}`
          )
          .then((res) => {
            setModels(res.data.result || []);
            setLoadingModels(false);
          })
          .catch((err) => {
            console.error("Error fetching models", err);
            setModels([]);
            setLoadingModels(false);
            toast.error("Failed to fetch vehicle makes.");
          });
      }
    } else {
      setModels([]);
      setSubmodels([]);
    }
  }, [form.vehicle_type, brands]);

  useEffect(() => {
    if (form.vehicle_make) {
      setLoadingSubModels(true);
      axios
        .get(
          `https://stockmgt.gapaautoparts.com/api/getSubModelByModelId?model_id=${form.vehicle_make}`
        )
        .then((res) => {
          setSubmodels(res.data.result || []);
          setLoadingSubModels(false);
        })
        .catch((err) => {
          console.error("Error fetching submodels", err);
          setSubmodels([]);
          setLoadingSubModels(false);
          toast.error("Failed to fetch vehicle models.");
        });
    } else {
      setSubmodels([]);
    }
  }, [form.vehicle_make]);

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
      setForm((prev) => ({
        ...prev,
        [name]: value,
        ...(name === "vehicle_type"
          ? { vehicle_make: "", vehicle_model: "" }
          : {}),
        ...(name === "vehicle_make" ? { vehicle_model: "" } : {}),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !form.vehicle_type ||
      !form.vehicle_make ||
      !form.vehicle_model ||
      !form.vin_number ||
      (isExpanded &&
        (!form.full_name ||
          !form.service_required ||
          !form.service_center ||
          !form.service_date ||
          !form.service_time))
    ) {
      toast.error(
        isExpanded
          ? "Please fill in all required fields, including additional details."
          : "Please fill in all required vehicle fields."
      );
      return;
    }
    if (!isValidVIN(form.vin_number)) {
      toast.error(
        "Please enter a valid 17-character VIN (letters and numbers, no I/O/Q)."
      );
      return;
    }
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Please log in to add a vehicle.", {
        action: {
          label: "Log In",
          onClick: () => navigate("/signin"),
        },
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = {
        vehicle_type: form.vehicle_type,
        vehicle_make:
          models.find((m) => m.id.toString() === form.vehicle_make)?.name ||
          form.vehicle_make,
        vehicle_model:
          submodels.find((s) => s.id.toString() === form.vehicle_model)?.name ||
          form.vehicle_model,
        vin_number: form.vin_number,
        full_name: form.full_name || null,
        year_of_manufacture: form.year_of_manufacture || null,
        service_required: form.service_required || null,
        service_center: form.service_center || null,
        additional_services: form.additional_services.length
          ? form.additional_services
          : [],
        service_date: form.service_date || null,
        service_time: form.service_time || null,
      };
      const response = await axios.post(
        "https://api.gapafix.com.ng/api/car_registration",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const newVehicle = {
        id: response.data.vehicle_id || Date.now(),
        vehicle_type: payload.vehicle_type,
        make: payload.vehicle_make,
        model: payload.vehicle_model,
        vin_number: payload.vin_number,
        full_name: payload.full_name || "N/A",
        year: payload.year_of_manufacture || "N/A",
        service_required: payload.service_required || "N/A",
        service_center: payload.service_center || "N/A",
        additional_services: payload.additional_services || [],
        service_date: payload.service_date || "N/A",
        service_time: payload.service_time || "N/A",
        booking_id: response.data.booking_id || null,
      };
      setVehicles((prev) => [...prev, newVehicle]);
      toast.success("Vehicle added successfully!");
      onClose();
      setForm({
        vehicle_type: "",
        vehicle_make: "",
        vehicle_model: "",
        vin_number: "",
        full_name: "",
        year_of_manufacture: "",
        service_required: "",
        service_center: "",
        additional_services: [],
        service_date: "",
        service_time: "",
      });
      setIsExpanded(false);
    } catch (err) {
      console.error("Error adding vehicle", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("authToken");
        toast.error("Session expired. Please log in again.", {
          action: {
            label: "Log In",
            onClick: () => navigate("/signin"),
          },
        });
      } else {
        toast.error("Failed to add vehicle. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-xl shadow-lg p-6 sm:max-w-lg mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Add Vehicle</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black text-lg"
          >
            ×
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-6">
          Register a car so you can book services and track history.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle Type<span className="text-[#FF0000]">*</span>
              </label>
              <div className="relative">
                <select
                  name="vehicle_type"
                  value={form.vehicle_type}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className="w-full bg-[#F2F2F2] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors appearance-none"
                >
                  <option value="">Select a type</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.name}>
                      {brand.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle Make<span className="text-[#FF0000]">*</span>
              </label>
              <div className="relative">
                <select
                  name="vehicle_make"
                  value={form.vehicle_make}
                  onChange={handleChange}
                  required
                  disabled={loadingModels || !form.vehicle_type}
                  className="w-full bg-[#F2F2F2] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors appearance-none"
                >
                  <option value="">Select a make</option>
                  {models.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.name}
                    </option>
                  ))}
                </select>
                {loadingModels && (
                  <p className="text-sm text-gray-500 mt-1">Loading makes...</p>
                )}
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle Model<span className="text-[#FF0000]">*</span>
              </label>
              <div className="relative">
                <select
                  name="vehicle_model"
                  value={form.vehicle_model}
                  onChange={handleChange}
                  required
                  disabled={loadingSubModels || !form.vehicle_make}
                  className="w-full bg-[#F2F2F2] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors appearance-none"
                >
                  <option value="">Select a model</option>
                  {submodels.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
                {loadingSubModels && (
                  <p className="text-sm text-gray-500 mt-1">
                    Loading models...
                  </p>
                )}
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
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
                maxLength={17}
                disabled={isSubmitting}
                className="w-full bg-[#F2F2F2] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                placeholder="Enter your 17-character VIN"
              />
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
          </div>
          <div className="flex items-center space-x-2">
            <div
              className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${
                isExpanded ? "bg-[#492F92]" : "bg-gray-300"
              }`}
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow absolute top-0.5 transition-transform ${
                  isExpanded ? "translate-x-6" : "left-0.5"
                }`}
              />
            </div>
            <span className="text-sm text-gray-700">
              Add additional vehicle and service details
            </span>
          </div>
          {isExpanded && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name<span className="text-[#FF0000]">*</span>
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={form.full_name}
                  onChange={handleChange}
                  required={isExpanded}
                  disabled={isSubmitting}
                  className="w-full bg-[#F2F2F2] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year of Manufacture
                </label>
                <select
                  name="year_of_manufacture"
                  value={form.year_of_manufacture}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full bg-[#F2F2F2] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
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
                    required={isExpanded}
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
                  Service Time<span className="text-[#FF0000]">*</span>
                </label>
                <input
                  type="time"
                  name="service_time"
                  value={form.service_time}
                  onChange={handleChange}
                  required={isExpanded}
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
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-[#492F92] text-white py-2 rounded-md text-sm font-medium hover:bg-[#3b2371] transition-colors ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Submitting..." : "Add Vehicle"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddVehicleModal;
