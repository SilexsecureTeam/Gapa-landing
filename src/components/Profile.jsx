import { useEffect, useState } from "react";
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
    additionalServices: [], // Initialized as array
  });

  const [step, setStep] = useState(1);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [submodels, setSubmodels] = useState([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [loadingSubModels, setLoadingSubModels] = useState(false);

  // Define available services for multi-select
  const availableServices = [
    "Oil Change",
    "Tire Rotation",
    "Brake Inspection",
    "Car Detailing",
    "Wheel Alignment",
  ];

  const navigate = useNavigate();
  const location = useLocation();
  const trustData = location.state?.trustData || {};
  const bookingId = trustData.bookingId;

  // Fetch brands
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

  // Fetch models
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

  // Fetch submodels
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
    setStep(2);
  };

  const handleStep2Submit = async (e) => {
    e.preventDefault();
    if (!form.yearOfManufacture || !form.phone || !form.email) {
      toast.error("Please fill in all required fields in Step 2.");
      return;
    }
    if (!bookingId) {
      toast.error(
        "Invalid booking ID. Please start the booking process again."
      );
      navigate("/");
      return;
    }

    const selectedMake = models.find((m) => m.id === form.vehicleMake);
    const selectedModel = submodels.find(
      (s) => s.id === Number(form.vehicleModel)
    );

    try {
      const response = await axios.post(
        `https://api.gapafix.com.ng/api/bookings/${bookingId}/register-car`,
        {
          full_name: form.fullName,
          vehicle_make: selectedMake?.name || form.vehicleMake,
          vehicle_model: selectedModel?.name || form.vehicleModel || null,
          vin_number: form.vin,
          year_of_manufacture: form.yearOfManufacture,
          phone: form.phone,
          email: form.email,
          additional_services:
            form.additionalServices.length > 0 ? form.additionalServices : null,
        }
      );
      console.log("Response:", response.data);
      navigate("/calendar", {
        state: {
          formData: {
            ...form,
            vehicleMake: selectedMake?.name || form.vehicleMake,
            vehicleModel: selectedModel?.name || form.vehicleModel,
          },
          trustData,
        },
      });
    } catch (error) {
      console.error("Error registering car:", error);
      console.log("Response data:", error.response?.data);
      console.log("Payload sent:", {
        full_name: form.fullName,
        vehicle_make: selectedMake?.name || form.vehicleMake,
        vehicle_model: selectedModel?.name || form.vehicleModel || null,
        vin_number: form.vin,
        year_of_manufacture: form.yearOfManufacture,
        phone: form.phone,
        email: form.email,
        additional_services: form.additionalServices,
      });
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.errors?.additional_services?.[0] ||
        "Failed to register car. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen py-8 md:py-12 px-4 sm:px-8 md:px-16 lg:px-20">
      <div className="flex w-full max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Left: Form */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-12 lg:p-16 flex flex-col justify-center">
          <h2 className="text-2xl sm:text-[27px] font-bold text-[#141414] mb-8">
            Car Registration
          </h2>
          {step === 1 ? (
            <form onSubmit={handleStep1Submit} className="space-y-6">
              {/* Full Name */}
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

              {/* Vehicle Make */}
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

              {/* Vehicle Model */}
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

              {/* VIN */}
              <div>
                <label className="block text-base font-semibold text-[#333333] mb-1">
                  Vehicle Identification Number (VIN)
                  <span className="text-[#FF0000]">*</span>
                </label>
                <input
                  type="text"
                  name="vin"
                  value={form.vin}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#F2F2F2] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                  placeholder="Enter your VIN"
                />
              </div>

              {/* Submit Step 1 */}
              <button
                type="submit"
                className="w-full bg-[#492F92] mt-3 text-white py-2 rounded-md hover:bg-indigo-700 font-semibold transition-colors"
              >
                Continue to Step 2
              </button>
            </form>
          ) : (
            <form onSubmit={handleStep2Submit} className="space-y-6">
              {/* Year of Manufacture */}
              <div>
                <label className="block text-base font-semibold text-[#333333] mb-1">
                  Year of Manufacture<span className="text-[#FF0000]">*</span>
                </label>
                <input
                  type="text"
                  name="yearOfManufacture"
                  value={form.yearOfManufacture}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#F2F2F2] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                  placeholder="Enter year (e.g., 2020)"
                />
              </div>

              {/* Phone */}
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
                  placeholder="Enter your phone number"
                />
              </div>

              {/* Email */}
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

              {/* Additional Services */}
              <div>
                <label className="block text-base font-semibold text-[#333333] mb-1">
                  Additional Services
                </label>
                <div className="w-full bg-[#F2F2F2] rounded-md px-3 py-2">
                  {availableServices.map((service) => (
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
                      />
                      <span>{service}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Back and Submit Step 2 */}
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/2 bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600 font-semibold transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-[#492F92] mt-3 text-white py-2 rounded-md hover:bg-indigo-700 font-semibold transition-colors"
                >
                  Continue
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right: Image */}
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
