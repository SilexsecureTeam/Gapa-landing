// src/components/Dashboard/Quote.jsx
import React, { useState, useEffect } from "react";
import { ChevronDown, Calendar } from "lucide-react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import detail from "../../assets/detail.png";

const Quote = () => {
  const { fleetName } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [maintStartDate, setMaintStartDate] = useState("");
  const [maintEndDate, setMaintEndDate] = useState("");
  const [totalCost, setTotalCost] = useState("");
  const [changeParts, setChangeParts] = useState("");
  const [maintenanceType, setMaintenanceType] = useState("");
  const [parts, setParts] = useState([]);

  useEffect(() => {
    if (location.state) {
      const { startDate, endDate, maintenanceType: mt, totalCost: cost, selectedParts } = location.state;
      setSelectedCustomer(fleetName || "");
      setMaintStartDate(startDate || "");
      setMaintEndDate(endDate || "");
      setTotalCost(cost || "");
      setMaintenanceType(mt || "");

      // Clear parts and populate only with valid selectedParts
      const newParts = [];
      if (selectedParts && selectedParts.length > 0) {
        selectedParts.forEach((part) => {
          if (part.name && part.price && part.quantity && part.id) {
            newParts.push({
              id: part.id,
              name: part.name,
              price: parseFloat(part.price),
              quantity: parseInt(part.quantity),
              totalPrice: parseFloat(part.totalPrice),
            });
          }
        });
      }
      setParts(newParts);
    } else {
      setParts([]);
    }
  }, [location.state, fleetName]);

  const handleAddFleet = () => {
    navigate(`/dashboard/quote/${encodeURIComponent(fleetName)}/add-fleet`, {
      state: { fleetName, selectedCustomer, maintenanceType, totalCost, maintStartDate, maintEndDate },
    });
  };

  return (
    <div className="w-full mx-auto p-6 bg-white overflow-y-auto custom-scrollbar">
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-[#333333] mb-4">Select Customer</h2>
        <div className="relative mb-4 max-w-4xl">
          <select
            className="w-full px-3 py-2 border border-[#E6E6E6] rounded-md bg-[#F9F9F9] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            value={selectedCustomer}
            onChange={(e) => setSelectedCustomer(e.target.value)}
          >
            <option value="">All Customers</option>
            <option value="ALFR787E646">ALFR787E646</option>
            <option value="customer2">Customer 2</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
        <h2 className="text-lg font-semibold text-[#333333] mb-4">Details</h2>
        <div className="mb-6 max-w-4xl">
          <div className="flex flex-col md:flex-row space-y-4 items-center justify-between text-sm">
            <div className="flex items-center space-x-3 bg-[#F5CE4D] rounded-xl px-8 py-3">
              <img src={detail} alt="" />
              <div className="">
                <span className="text-gray-800 font-medium">Toyota Corolla - 2019</span>
                <h2 className="text-xs text-gray-600 mt-1">Plate: LND-45JK · Petrol · Automatic</h2>
              </div>
            </div>
            <div className="text-gray-700 text-left">
              <div className="text-sm">Fleet ID : <span className="font-medium">ALFR7656544</span></div>
              <div className="text-sm">Fleet Type: <span className="font-medium">SUV</span></div>
            </div>
            <div className="text-gray-700 text-right">
              <div className="text-sm">First Owner: <span className="font-medium">01-Jan-2020</span></div>
            </div>
          </div>
        </div>
      </div>
      <div className="mb-8 max-w-3xl">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-base font-medium text-black mb-1">Maintenance Start Date</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Choose Start date"
                className="w-full px-3 py-2 border border-[#E6E6E6] bg-[#F9F9F9] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={maintStartDate}
                onChange={(e) => setMaintStartDate(e.target.value)}
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>
          <div>
            <label className="block text-black font-medium text-base mb-1">Maintenance End Date</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Choose End date"
                className="w-full px-3 py-2 border border-[#E6E6E6] bg-[#F9F9F9] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={maintEndDate}
                onChange={(e) => setMaintEndDate(e.target.value)}
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
        <div className="mb-4">
          <textarea
            placeholder="Message"
            className="w-full px-3 py-3 border border-[#BDBDBD] bg-[#FBF6F6] rounded-md text-sm h-30 overflow-auto resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="relative mb-4">
          <select
            className="w-full px-3 py-2 border border-[#E6E6E6] rounded-md bg-[#F9F9F9] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            value={maintenanceType}
            onChange={(e) => setMaintenanceType(e.target.value)}
          >
            <option value="">Select Maintenance Type</option>
            <option value="Oil Services">Oil Services</option>
            <option value="Brake Services">Brake Services</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-black font-medium text-base mb-1">Total Cost</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-[#E6E6E6] rounded-md bg-[#F9F9F9] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={totalCost}
              onChange={(e) => setTotalCost(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-black font-medium text-base mb-1">Change Parts?</label>
            <div className="relative">
              <select
                className="w-full px-3 py-2 border border-[#E6E6E6] rounded-md bg-[#F9F9F9] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                value={changeParts}
                onChange={(e) => setChangeParts(e.target.value)}
              >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={handleAddFleet}
          className="w-full bg-[#4B3193] text-white py-3 rounded-md text-sm font-medium hover:bg-[#3A256F] transition-colors mb-6"
        >
          Click here to choose part name
        </button>
      </div>
      <div className="mb-8 max-w-3xl px-3 bg-[#F9F9F9]">
        <div className="flex flex-wrap justify-between py-3 text-sm font-medium text-[#333333]">
          <div className="flex-1">Part Name</div>
          <div className="flex-1">Unit Price</div>
          <div className="flex-1">Qty</div>
          <div className="flex-1">Total Price</div>
        </div>
        {parts.length === 0 ? (
          <div className="py-8 text-center text-gray-400 text-sm">
            No parts added yet
          </div>
        ) : (
          parts.map((part) => (
            <div
              key={part.id}
              className="flex flex-wrap justify-between py-3 text-sm text-gray-600"
            >
              <div className="flex-1">{part.name}</div>
              <div className="flex-1">₦{part.price.toLocaleString()}</div>
              <div className="flex-1">{part.quantity}</div>
              <div className="flex-1">₦{part.totalPrice.toLocaleString()}</div>
            </div>
          ))
        )}
      </div>
      <div className="w-full max-w-3xl flex justify-end mb-14 md:mb-0">
        <button className="w-full max-w-sm bg-[#B80707] text-white py-3 rounded-md font-medium hover:bg-red-700 transition-colors">
          GENERATE QUOTE
        </button>
      </div>
    </div>
  );
};

export default Quote;