import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import auth from "../assets/proflie.png";

const Profile = () => {
  const [form, setForm] = useState({
    fullName: "",
    vehicleMake: "",
    vehicleModel: "",
    vin: "",
    yearOfManufacture: "",
    phone: "",
    email: "",
    additionalServices: [],
  });

  const [step, setStep] = useState(1);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [submodels, setSubmodels] = useState([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [loadingSubModels, setLoadingSubModels] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableServices = [
    "Oil Service",
    "Brake System Service",
    "Diagnostic Services",
    "Paint & Bodywork",
    "Wheel Balancing & Alignment",
    "Tyre Change",
    "Car Detailing",
    "Suspension Systems",
    "Comprehensive Repairs",
    "Engine Check",
  ];

  const navigate = useNavigate();
  const location = useLocation();
  const trustData = location.state?.trustData || {};
  const bookingId = trustData.bookingId;

  const filteredAvailableServices = availableServices.filter(
    (service) => service.toLowerCase() !== trustData.service?.toLowerCase()
  );

  const isValidVIN = (vin) =>
    /^[A-HJ-NPR-Z0-9]{17}$/i.test(vin) && vin.length === 17;

  const isValidPhone = (phone) => {
    const cleanedPhone = phone.replace(/\s/g, "").trim();
    return /^(\+?\d{10,15})$/.test(cleanedPhone);
  };

  useEffect(() => {
    axios
      .get("https://stockmgt.gapaautoparts.com/api/brand/all-brand")
      .then((res) => setBrands(res.data.brands || []))
      .catch((err) => {
        console.error("❌ Error fetching brands", err);
        setBrands([{ name: "Toyota" }, { name: "Honda" }, { name: "Ford" }]);
        toast.error("Failed to fetch brands. Using fallback data.");
      });
  }, []);

  useEffect(() => {
    if (trustData.vehicle) {
      const selectedBrand = brands.find(
        (b) => b.name.toLowerCase() === trustData.vehicle.toLowerCase()
      );

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
            console.error("❌ Error fetching models", err);
            setModels([]);
            setLoadingModels(false);
            toast.error("Failed to fetch vehicle makes.");
          });
      }
    }
  }, [brands, trustData.vehicle]);

  useEffect(() => {
    if (form.vehicleMake) {
      setLoadingSubModels(true);
      axios
        .get(
          `https://stockmgt.gapaautoparts.com/api/getSubModelByModelId?model_id=${form.vehicleMake}`
        )
        .then((res) => {
          setSubmodels(res.data.result || []);
          setLoadingSubModels(false);
        })
        .catch((err) => {
          console.error("❌ Error fetching submodels", err);
          setSubmodels([]);
          setLoadingSubModels(false);
          toast.error("Failed to fetch vehicle models.");
        });
    }
  }, [form.vehicleMake]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "vehicleMake" ? { vehicleModel: "" } : {}),
    }));
  };

  const handleStep1Submit = (e) => {
    e.preventDefault();
    if (!form.fullName || !form.vehicleMake || !form.vin) {
      toast.error("Please fill in all required fields in Step 1.");
      return;
    }
    if (!isValidVIN(form.vin)) {
      toast.error(
        "Please enter a valid 17-character VIN (letters and numbers, no I/O/Q)."
      );
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setStep(2);
      setIsSubmitting(false);
    }, 500);
  };

  const handleStep2Submit = async (e) => {
    e.preventDefault();
    if (!form.yearOfManufacture || !form.phone || !form.email) {
      toast.error("Please fill in all required fields in Step 2.");
      return;
    }
    if (!isValidPhone(form.phone)) {
      toast.error(
        "Please enter a valid phone number (e.g., +2348012345678 or 10+ digits)."
      );
      return;
    }
    if (!bookingId) {
      toast.error(
        "Invalid booking ID. Please start the booking process again."
      );
      navigate("/");
      return;
    }

    setIsSubmitting(true);
    const selectedMake = models.find(
      (m) => m.id.toString() === form.vehicleMake
    );
    const selectedModel = submodels.find(
      (s) => s.id.toString() === form.vehicleModel.toString()
    );

    const vehicleMakeName =
      selectedMake?.name || trustData.vehicle || form.vehicleMake;
    const vehicleModelName = selectedModel?.name || form.vehicleModel;

    const payload = {
      full_name: form.fullName,
      vehicle_make: vehicleMakeName,
      vehicle_model: vehicleModelName || null,
      vin_number: form.vin,
      year_of_manufacture: form.yearOfManufacture,
      phone: form.phone,
      email: form.email,
      additional_services:
        form.additionalServices.length > 0 ? form.additionalServices : [], // Send array directly
    };

    try {
      const response = await axios.post(
        `https://api.gapafix.com.ng/api/bookings/${bookingId}/register-car`,
        payload, // Send payload directly as JSON object
        {
          headers: {
            "Content-Type": "application/json",
          },
          validateStatus: (status) => status < 600,
        }
      );
      console.log("Response:", response.data);
      if (response.status === 500) {
        throw new Error("Server internal error - check data validity");
      }
      navigate("/calendar", {
        state: {
          formData: {
            ...form,
            vehicleMake: vehicleMakeName,
            vehicleModel: vehicleModelName,
          },
          trustData,
        },
      });
    } catch (error) {
      console.error("Error registering car:", error);
      if (error.response) {
        console.log("Response data:", error.response.data);
        console.log("Response status:", error.response.status);
        console.log("Response headers:", error.response.headers);
      }
      console.log("Payload sent:", payload);
      let errorMessage =
        "Failed to register car. Please try again later or contact support at support@gapafix.com.ng.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 500) {
        errorMessage =
          "Server error - invalid data (e.g., VIN, phone, or vehicle details). Try realistic test data like in Postman.";
      }
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-8 md:py-12 px-4 sm:px-8 md:px-16 lg:px-20">
      <div className="flex w-full max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-12 lg:p-16 flex flex-col justify-center">
          <h2 className="text-2xl sm:text-[27px] font-bold text-[#141414] mb-8">
            Car Registration
          </h2>
          {step === 1 ? (
            <form onSubmit={handleStep1Submit} className="space-y-6">
              <div>
                <label className="block text-base font-semibold text-[#333333] mb-1">
                  Full Name<span className="text-[#FF0000]">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#F2F2F2] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                  placeholder="Please enter your full name"
                />
              </div>
              <div>
                <label className="block text-base font-semibold text-[#333333] mb-1">
                  Vehicle Make<span className="text-[#FF0000]">*</span>
                </label>
                <select
                  name="vehicleMake"
                  value={form.vehicleMake}
                  onChange={handleChange}
                  required
                  disabled={loadingModels || models.length === 0}
                  className="w-full bg-[#F2F2F2] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
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
              </div>
              <div>
                <label className="block text-base font-semibold text-[#333333] mb-1">
                  Vehicle Model<span className="text-[#FF0000]">*</span>
                </label>
                <select
                  name="vehicleModel"
                  value={form.vehicleModel}
                  onChange={handleChange}
                  disabled={!form.vehicleMake || loadingSubModels}
                  className="w-full bg-[#F2F2F2] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
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
                    Loading vehicle models...
                  </p>
                )}
              </div>
              <div>
                <label className="block text-base font-semibold text-[#333333] mb-1">
                  Vehicle Identification Number (VIN) / Chassis Number
                  <span className="text-[#FF0000]">*</span>
                </label>
                <input
                  type="text"
                  name="vin"
                  value={form.vin}
                  onChange={handleChange}
                  required
                  maxLength={17}
                  className="w-full bg-[#F2F2F2] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                  placeholder="Enter your 17-character VIN (e.g., 1HGCM82633A004352)"
                />
              </div>
              <button
                type="submit"
                className={`w-full bg-[#492F92] mt-3 text-white py-2 rounded-md hover:bg-indigo-700 font-semibold transition-colors flex items-center justify-center ${
                  isSubmitting || loadingModels || loadingSubModels
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                disabled={isSubmitting || loadingModels || loadingSubModels}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                      ></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  "Continue to Step 2"
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleStep2Submit} className="space-y-6">
              <div>
                <label className="block text-base font-semibold text-[#333333] mb-1">
                  Year of Manufacture<span className="text-[#FF0000]">*</span>
                </label>
                <select
                  name="yearOfManufacture"
                  value={form.yearOfManufacture}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className="w-full bg-[#F2F2F2] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
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
                <label className="block text-base font-semibold text-[#333333] mb-1">
                  Phone Number<span className="text-[#FF0000]">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#F2F2F2] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                  placeholder="Enter your phone number (e.g., +2348012345678)"
                />
              </div>
              <div>
                <label className="block text-base font-semibold text-[#333333] mb-1">
                  Email Address<span className="text-[#FF0000]">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#F2F2F2] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-base font-semibold text-[#333333] mb-1">
                  Additional Services
                </label>
                <div className="w-full bg-[#F2F2F2] rounded-md px-3 py-2">
                  {filteredAvailableServices.length > 0 ? (
                    filteredAvailableServices.map((service) => (
                      <label
                        key={service}
                        className="flex items-center space-x-2 mb-2"
                      >
                        <input
                          type="checkbox"
                          value={service}
                          checked={form.additionalServices.includes(service)}
                          onChange={(e) => {
                            const value = e.target.value;
                            setForm((prev) => ({
                              ...prev,
                              additionalServices: e.target.checked
                                ? [...prev.additionalServices, value]
                                : prev.additionalServices.filter(
                                    (s) => s !== value
                                  ),
                            }));
                          }}
                          className="form-checkbox"
                          disabled={isSubmitting}
                        />
                        <span className="text-base">{service}</span>
                      </label>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">
                      No additional services available.
                    </p>
                  )}
                </div>
              </div>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/2 bg-gray-500 mt-3 text-white py-2 rounded-md hover:bg-gray-600 font-semibold transition-colors"
                  disabled={isSubmitting}
                >
                  Back
                </button>
                <button
                  type="submit"
                  className={`w-1/2 bg-[#492F92] mt-3 text-white py-2 rounded-md hover:bg-indigo-700 font-semibold transition-colors flex items-center justify-center ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 mr-2 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                        ></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    "Continue"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
        <div className="hidden md:block md:w-1/2">
          <img
            src={auth}
            alt="Profile Visual"
            className="object-cover h-156 w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;
