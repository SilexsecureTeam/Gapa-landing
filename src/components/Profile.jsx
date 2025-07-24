import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import auth from "../assets/proflie.png";

const Profile = () => {
  const [form, setForm] = useState({
    fullName: "",
    vehicleMake: "",
    vehicleModel: "",
    vin: "",
  });

  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [loadingModels, setLoadingModels] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const trustData = location.state?.trustData || {};

  // Fetch car brands (makes) on page load
  useEffect(() => {
    console.log("⏳ Fetching brands using axios...");
    axios
      .get("https://stockmgt.gapaautoparts.com/api/brand/all-brand")
      .then((response) => {
        console.log("✅ Brand fetch response:", response.data);
        setBrands(response.data.brands || []);
      })
      .catch((err) => {
        console.error("❌ Fetch error:", err);
      });
  }, []);

  // Fetch car models when a brand is selected
  useEffect(() => {
    if (form.vehicleMake) {
      console.log("🚗 Fetching models for brand_id:", form.vehicleMake);
      setLoadingModels(true);
      axios
        .get(
          `https://stockmgt.gapaautoparts.com/api/getModelByBrandId?brand_id=${form.vehicleMake}`
        )
        .then((response) => {
          console.log("✅ Model fetch response:", response.data);
          setModels(response.data.result || []);
          setLoadingModels(false);
        })
        .catch((error) => {
          console.error(
            "❌ Error fetching car models:",
            error.response?.status,
            error.response?.data,
            error.message
          );
          setModels([]);
          setLoadingModels(false);
        });
    } else {
      setModels([]);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/success", { state: { formData: form, trustData } });
  };

  return (
    <div className="min-h-screen py-8 md:py-12 px-4 sm:px-8 md:px-16 lg:px-20">
      <div className="flex w-full max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Left: Form */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-12 lg:p-16 flex flex-col justify-center">
          <h2 className="text-2xl sm:text-[27px] font-bold text-[#141414] mb-8 ">
            Tell us about yourself
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                className="w-full bg-[#F2F2F2] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              >
                <option value="">Select a make</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
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
                required
                disabled={!form.vehicleMake || loadingModels}
                className="w-full bg-[#F2F2F2] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              >
                <option value="">Select a model</option>
                {models.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name}
                  </option>
                ))}
              </select>
              {loadingModels && (
                <p className="text-sm text-gray-500 mt-1">Loading models...</p>
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

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-[#492F92] mt-3 text-white py-2 rounded-md hover:bg-indigo-700 font-semibold transition-colors"
            >
              SUBMIT
            </button>
          </form>
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
