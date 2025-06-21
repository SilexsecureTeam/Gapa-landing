import React, { useState } from "react";
import {
  User,
  Phone,
  MapPin,
  Mail,
  Calendar,
  Users,
  Facebook,
  Twitter,
  Trash2,
  Pencil,
} from "lucide-react";

const InputField = ({
  label,
  icon: Icon,
  type = "text",
  value,
  onChange,
  placeholder,
  disabled,
  className = "",
  ...props
}) => (
  <div className="flex flex-col gap-1 w-full">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <div className="relative">
      {Icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Icon size={18} />
        </span>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`pl-10 pr-3 py-2 w-full border rounded-md transition text-gray-900 bg-white ${className}`}
        {...props}
      />
    </div>
  </div>
);

const Settings = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    country: "",
    streetAddress: "",
    email: "",
    dateOfBirth: "",
    gender: "",
    facebook: "",
    twitter: "",
  });

  const handleInputChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  return (
    <div className="w-full p-4 md:p-8 lg:p-10">
      <div className="w-full rounded-xl bg-white mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold mb-2">Settings</h2>
        <div className="flex flex-wrap gap-2 sm:gap-6 mb-6 overflow-x-auto">
          <button className="py-2 px-3 text-gray-600 hover:text-purple-600 border-b-2 border-transparent focus:outline-none whitespace-nowrap">
            My details
          </button>
          <button className="py-2 px-3 text-black font-semibold bg-gray-100 focus:outline-none whitespace-nowrap">
            Profile
          </button>
          <button className="py-2 px-3 text-gray-600 hover:text-purple-600 border-b-2 border-transparent focus:outline-none whitespace-nowrap">
            Password
          </button>
          <button className="py-2 px-3 text-gray-600 hover:text-purple-600 border-b-2 border-transparent focus:outline-none whitespace-nowrap">
            Email
          </button>
          <button className="py-2 px-3 text-gray-600 hover:text-purple-600 border-b-2 border-transparent focus:outline-none whitespace-nowrap">
            Notification
          </button>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-1">Profile</h3>
          <p className="text-gray-500 text-sm mb-4 border-b border-b-gray-200 pb-4">
            Update your photo and personal details here.
          </p>
          <form className="space-y-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <InputField
                label="Full Name"
                icon={User}
                value={formData.fullName}
                onChange={handleInputChange("fullName")}
                placeholder="Enter your full name"
              />
              <InputField
                label="Phone Number"
                icon={Phone}
                value={formData.phoneNumber}
                onChange={handleInputChange("phoneNumber")}
                placeholder="Enter your phone number"
              />
              <InputField
                label="Country"
                icon={MapPin}
                value={formData.country}
                onChange={handleInputChange("country")}
                placeholder="Enter your country"
              />
              <InputField
                label="Street Address"
                icon={MapPin}
                value={formData.streetAddress}
                onChange={handleInputChange("streetAddress")}
                placeholder="Enter your street address"
              />
            </div>

            <div className="w-full">
              <InputField
                label="Email Address"
                icon={Mail}
                type="email"
                value={formData.email}
                onChange={handleInputChange("email")}
                placeholder="Enter your email address"
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <InputField
                label="Date Of Birth"
                icon={Calendar}
                type="date"
                value={formData.dateOfBirth}
                onChange={handleInputChange("dateOfBirth")}
                placeholder="Select your date of birth"
              />
              <div className="flex flex-col gap-1 w-full">
                <label className="text-sm font-medium text-gray-700">
                  Gender
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Users size={18} />
                  </span>
                  <select
                    value={formData.gender}
                    onChange={handleInputChange("gender")}
                    className="pl-10 pr-3 py-2 w-full border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition text-gray-900 bg-white"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row items-start lg:items-center w-full gap-4 mt-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4">
                <div className=" md:w-fit ">
                  <h3 className="text-lg font-semibold mb-1">Your Photo</h3>
                  <p className="text-gray-500 text-sm">
                    This will be displayed on your profile.
                  </p>
                </div>
                <span className="block w-14 h-14 rounded-full overflow-hidden border-2 border-purple-500 flex-shrink-0">
                  <img
                    src="https://randomuser.me/api/portraits/men/32.jpg"
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      className="text-purple-600 hover:underline flex items-center gap-1 text-sm"
                    >
                      <Pencil size={16} /> Update
                    </button>
                    <button
                      type="button"
                      className="text-red-600 hover:underline flex items-center gap-1 text-sm"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col md:flex-row md:justify-between">
              <label className="text-sm font-medium text-gray-700 mb-4 block">
                Social Profiles
              </label>
              <div className="flex flex-col gap-4">
                <div className="relative w-full">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600">
                    <Facebook size={18} />
                  </span>
                  <input
                    type="text"
                    value={formData.facebook}
                    onChange={handleInputChange("facebook")}
                    placeholder="facebook.com/"
                    className="pl-10 pr-3 py-2 w-full border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition text-gray-900 bg-white"
                  />
                </div>
                <div className="relative w-full">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
                    <Twitter size={18} />
                  </span>
                  <input
                    type="text"
                    value={formData.twitter}
                    onChange={handleInputChange("twitter")}
                    placeholder="twitter.com/"
                    className="pl-10 pr-3 py-2 w-full border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition text-gray-900 bg-white"
                  />
                </div>
              </div>
              <div className="hidden md:block"></div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                type="submit"
                className="bg-purple-600 text-white px-5 py-2 rounded-md hover:bg-purple-700 transition"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
