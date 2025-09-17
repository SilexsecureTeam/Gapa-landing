import React, { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const AddFleet = () => {
  const [selectedBrand, setSelectedBrand] = useState("");
  const [model, setModel] = useState("");
  const [selectedSubModel, setSelectedSubModel] = useState("");
  const [partNumber, setPartNumber] = useState("");
  const navigate = useNavigate();
  const { fleetName } = useParams();
  const location = useLocation();

  const handleCancel = () => {
    navigate(`/dashboard/quote/${encodeURIComponent(fleetName)}`, {
      state: location.state,
    });
  };

  const handleAddModel = () => {
    if (!partNumber && (!selectedBrand || !model || !selectedSubModel)) {
      alert(
        "Please fill in either part number or brand, model, and sub-model."
      );
      return;
    }
    const newPart = {
      partName: partNumber || `${selectedBrand} ${model} ${selectedSubModel}`,
      price: "100", // Placeholder, replace with actual logic
      qty: "1", // Placeholder, replace with actual logic
      totalPrice: "100", // Placeholder, replace with actual logic
    };
    navigate(`/dashboard/quote/${encodeURIComponent(fleetName)}`, {
      state: { ...location.state, newPart },
    });
  };

  return (
    <div className="w-full mx-auto p-6 bg-white overflow-y-auto custom-scrollbar">
      <div className="max-w-3xl">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-[#333333] mb-6">
            Add Fleet Model
          </h2>
          <button
            onClick={handleCancel}
            className="h-5 w-5 flex items-center cursor-pointer justify-center bg-red-700 text-white font-medium rounded-full transition-colors"
          >
            x
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Select Brand
            </label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
            >
              <option value="">Choose a brand...</option>
              <option value="toyota">Toyota</option>
              <option value="honda">Honda</option>
              <option value="ford">Ford</option>
              <option value="chevrolet">Chevrolet</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Enter Model
            </label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="Enter model name..."
              className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Select Sub Model
            </label>
            <select
              value={selectedSubModel}
              onChange={(e) => setSelectedSubModel(e.target.value)}
              className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
            >
              <option value="">Choose a sub model...</option>
              <option value="base">Base</option>
              <option value="premium">Premium</option>
              <option value="sport">Sport</option>
              <option value="luxury">Luxury</option>
            </select>
          </div>
          <button
            onClick={handleAddModel}
            className="w-full bg-[#4B3193] hover:bg-[#3A256F] text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            ADD MODEL
          </button>
          <div className="flex items-center justify-center py-2">
            <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">OR</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Search with part Number
            </label>
            <input
              type="text"
              value={partNumber}
              onChange={(e) => setPartNumber(e.target.value)}
              placeholder="Enter part number..."
              className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
            />
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleAddModel}
              className="w-full bg-[#4B3193] hover:bg-[#3A256F] text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              ADD MODEL
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFleet;
