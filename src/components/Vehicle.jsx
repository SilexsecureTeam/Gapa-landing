import React, { useState } from "react";
import * as Progress from "@radix-ui/react-progress";
import { Plus } from "lucide-react";
import Veh from "../assets/vehicle.png";
import { Link } from "react-router-dom";

const DEFAULT_VEHICLE = {
  year: "2022",
  name: "Toyota Corolla",
  license: "ABC-1234",
  image: Veh,
};

const Vehicle = () => {
  const [vehicles, setVehicles] = useState([
    DEFAULT_VEHICLE,
    DEFAULT_VEHICLE,
    DEFAULT_VEHICLE,
  ]);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    year: "",
    name: "",
    license: "",
    image: null,
    imageUrl: "",
  });

  // Handle file input and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({
        ...form,
        image: file,
        imageUrl: URL.createObjectURL(file),
      });
    }
  };

  // Handle form input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add vehicle to list
  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.year && form.name && form.license && form.imageUrl) {
      setVehicles([
        {
          year: form.year,
          name: form.name,
          license: form.license,
          image: form.imageUrl,
        },
        ...vehicles,
      ]);
      setForm({ year: "", name: "", license: "", image: null, imageUrl: "" });
      setShowForm(false);
    }
  };

  return (
    <div className="py-4 lg:py-6 px-4 sm:px-6 md:px-16 lg:px-24 w-full mx-auto ">
      {/* Progress Bar */}
      <div className="mb-4 sm:mb-6 py-4 sm:py-5 px-4 sm:px-6 md:px-10 bg-white rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs sm:text-sm font-medium text-[#141414]">
            Progress
          </span>
          <span className="text-xs sm:text-sm font-medium text-[#492F92]">
            20% completed
          </span>
        </div>
        <Progress.Root
          className="relative overflow-hidden bg-[#f3f1f7] rounded-full w-full h-3 sm:h-4"
          value={20}
        >
          <Progress.Indicator
            className="bg-[#492F92] h-full transition-transform duration-500 ease-out"
            style={{ transform: "translateX(-80%)" }}
          />
        </Progress.Root>
      </div>

      <div className="bg-white shadow rounded-lg p-4 sm:p-6 md:p-10">
        <h2 className="text-xl sm:text-2xl md:text-[30px] lg:text-[36px] font-semibold text-[#333333]">
          Your Vehicles
        </h2>
        <h2 className="text-sm sm:text-base md:text-lg font-normal text-[#333333] mb-4 sm:mb-6">
          Manage your vehicles or add a new one to your account.
        </h2>
        <h2 className="text-lg sm:text-xl md:text-[22px] font-semibold text-[#141414] mb-2">
          Registered Vehicles
        </h2>
        {/* Vehicle List */}
        <div className="flex flex-col gap-4 sm:gap-6 mb-4 sm:mb-6">
          {vehicles.map((v, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row items-start justify-between gap-4"
            >
              <div className="flex-1">
                <div className="text-[#757575] text-sm sm:text-base">
                  {v.year}
                </div>
                <div className="font-semibold text-[#141414] text-base sm:text-lg">
                  {v.name}
                </div>
                <div className="text-[#757575] text-sm sm:text-base">
                  License Plate: {v.license}
                </div>
              </div>
              <div className="sm-mt-0 w-40 h-20 sm:w-80 sm:h-40 flex-shrink-0">
                <img
                  src={v.image}
                  alt={v.name}
                  className="object-cover w-full h-full rounded"
                />
              </div>
            </div>
          ))}
        </div>
        {/* Add Vehicle Button */}
        <div className="flex justify-start mt-6 sm:mt-10">
          {/* <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-[#492F92] text-white px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base cursor-pointer rounded shadow hover:bg-[#3a236d]"
          >
            <Plus size={16} className="sm:h-5 sm:w-5" /> Add a Vehicle
          </button> */}
          <Link to="/book-second">
            {" "}
            <button
              // onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-[#492F92] text-white px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base cursor-pointer rounded shadow hover:bg-[#3a236d]"
            >
              <Plus size={16} className="sm:h-5 sm:w-5" /> Add a Vehicle
            </button>{" "}
          </Link>
        </div>
      </div>

      {/* Add Vehicle Form (Modal-like) */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4"
        >
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md sm:max-w-lg relative">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="absolute top-2 right-2 text-black cursor-pointer text-xl sm:text-2xl"
            >
              ×
            </button>
            <h2 className="text-lg sm:text-xl font-semibold mb-4">
              Add a Vehicle
            </h2>
            <div className="mb-3">
              <label className="block text-xs sm:text-sm font-medium mb-1">
                Year
              </label>
              <input
                type="number"
                name="year"
                value={form.year}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1 text-sm sm:text-base"
                required
              />
            </div>
            <div className="mb-3">
              <label className="block text-xs sm:text-sm font-medium mb-1">
                Vehicle Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1 text-sm sm:text-base"
                required
              />
            </div>
            <div className="mb-3">
              <label className="block text-xs sm:text-sm font-medium mb-1">
                License Plate No
              </label>
              <input
                type="text"
                name="license"
                value={form.license}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1 text-sm sm:text-base"
                required
              />
            </div>
            <div className="mb-3">
              <label className="block text-xs sm:text-sm font-medium mb-1">
                Vehicle Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full text-sm sm:text-base"
                required
              />
              {form.imageUrl && (
                <img
                  src={form.imageUrl}
                  alt="Preview"
                  className="mt-2 w-24 h-16 sm:w-32 sm:h-20 object-cover rounded"
                />
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-[#492F92] hover:bg-[#3a236d] cursor-pointer text-white py-2 rounded mt-2 text-sm sm:text-base"
            >
              Add Vehicle
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
export default Vehicle;
