import { useState } from "react";
import { useNavigate } from "react-router-dom";
import auth from "../assets/proflie.png";

const Profile = () => {
  const [form, setForm] = useState({
    fullName: "",
    vehicleMake: "",
    vehicleModel: "",
    vin: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit logic here
    // alert(JSON.stringify(form, null, 2));
    navigate("/profile-mec");
  };

  return (
    <div className="min-h-screen py-8 md:py-12 px-4 sm:px-8 md:px-16 lg:px-20">
      <div className="flex w-full max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Left: Form */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-12 lg:p-16 flex flex-col justify-center">
          <h2 className="text-2xl sm:text-[27px] font-bold text-[#141414] mb-8 ">
            Tell us about yourself
          </h2>
          {/* Controlled Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
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
              <input
                type="text"
                name="vehicleMake"
                value={form.vehicleMake}
                onChange={handleChange}
                required
                className="w-full bg-[#F2F2F2] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                placeholder="e.g., Toyota"
              />
            </div>
            <div>
              <label className="block text-base font-semibold text-[#333333] mb-1">
                Vehicle Model<span className="text-[#FF0000]">*</span>
              </label>
              <input
                type="text"
                name="vehicleModel"
                value={form.vehicleModel}
                onChange={handleChange}
                required
                className="w-full bg-[#F2F2F2] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                placeholder="e.g., Camry"
              />
            </div>
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
