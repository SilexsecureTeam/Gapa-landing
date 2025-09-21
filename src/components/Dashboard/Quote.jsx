// src/components/Dashboard/Quote.jsx
import React, { useState, useEffect } from "react";
import { ChevronDown, Calendar, Plus, Trash2 } from "lucide-react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { format, isBefore } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import detail from "../../assets/detail.png";
import { toast } from "react-toastify";

const Quote = () => {
  const { fleetName } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [customerName, setCustomerName] = useState("");
  const [maintStartDate, setMaintStartDate] = useState(null);
  const [maintEndDate, setMaintEndDate] = useState(null);
  const [labourCost, setLabourCost] = useState("");
  const [changeParts, setChangeParts] = useState("");
  const [maintenanceType, setMaintenanceType] = useState("");
  const [message, setMessage] = useState("");
  const [parts, setParts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [maintenanceOptions, setMaintenanceOptions] = useState([]);

  const [showManualAdd, setShowManualAdd] = useState(false);
  const [manualPartName, setManualPartName] = useState("");
  const [manualQuantity, setManualQuantity] = useState(1);
  const [manualUnitPrice, setManualUnitPrice] = useState("");

  const partsTotal = parts.reduce(
    (sum, part) => sum + (part.totalPrice || 0),
    0
  );
  const mainTotalCost = (partsTotal + (parseFloat(labourCost) || 0)).toFixed(2);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const user = localStorage.getItem("user");

    if (!token || !user) {
      navigate("/signin", { state: { from: window.location.pathname } });
      return;
    }

    if (location.state) {
      console.log("location.state:", location.state); // Debug: Log location.state
      const {
        service_date,
        service_required,
        additional_services,
        full_name,
        selectedParts,
        id,
      } = location.state;
      setCustomerName(full_name || "");
      setMaintStartDate(service_date ? new Date(service_date) : null);
      setMaintEndDate(null);
      setLabourCost("");
      setMaintenanceType(service_required || "");
      setMessage("");

      const options = [service_required, ...(additional_services || [])].filter(
        Boolean
      );
      setMaintenanceOptions(options);

      const savedCart = localStorage.getItem(`cartItems_${id}`);
      const cartItems = savedCart ? JSON.parse(savedCart) : [];
      const newParts = (selectedParts || cartItems || []).map((part) => ({
        id: part.id,
        name: part.name,
        price: parseFloat(part.price),
        quantity: parseInt(part.quantity),
        totalPrice: parseFloat(part.totalPrice),
      }));
      setParts(newParts);
    } else {
      setParts([]);
      localStorage.removeItem(`cartItems_${fleetName}`);
      toast.error("No booking data provided. Please select a booking.", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/dashboard");
    }
  }, [location.state, navigate, fleetName]);

  useEffect(() => {
    if (location.state?.id) {
      localStorage.setItem(
        `cartItems_${location.state.id}`,
        JSON.stringify(parts)
      );
    }
  }, [parts, location.state]);

  const handleAddFleet = () => {
    navigate(`/dashboard/quote/${encodeURIComponent(fleetName)}/add-fleet`, {
      state: {
        fleetName,
        customerName,
        maintenanceType,
        labourCost,
        maintStartDate,
        maintEndDate,
        id: location.state?.id,
      },
    });
  };

  const handleUpdateEndDate = async () => {
    const token = localStorage.getItem("authToken");
    if (!token || !location.state?.id || !maintEndDate) return;

    if (maintStartDate && isBefore(maintEndDate, maintStartDate)) {
      toast.error("Maintenance end date must be after or equal to start date", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }

    try {
      await axios.patch(
        `https://api.gapafix.com.ng/api/bookings/${location.state.id}`,
        { maintenance_end_date: format(maintEndDate, "yyyy-MM-dd") },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("End date updated successfully", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (err) {
      console.error("Failed to update end date:", err.message);
      toast.error("Failed to update end date", {
        position: "top-right",
        autoClose: 2000,
      });
      if (err.response?.status === 401) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        navigate("/signin", { state: { from: window.location.pathname } });
      }
    }
  };

  const validateBookingId = async (id) => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.get(
        `https://api.gapafix.com.ng/api/bookings/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Booking validation response:", response.data); // Debug: Log response
      return true;
    } catch (err) {
      console.error(
        "Booking ID validation failed:",
        err.message,
        err.response?.data
      );
      return false;
    }
  };

  const handleGenerateQuote = async () => {
    const token = localStorage.getItem("authToken");
    if (!token || !location.state?.id) {
      toast.error("Missing booking ID or authentication", {
        position: "top-right",
        autoClose: 2000,
      });
      navigate("/dashboard");
      return;
    }

    const isValidBooking = await validateBookingId(location.state.id);
    if (!isValidBooking) {
      toast.error("Invalid or non-existent booking ID", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (!labourCost || !message) {
      toast.error("Labour cost and message are required", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }

    if (parseFloat(labourCost) < 0) {
      toast.error("Labour cost cannot be negative", {
        position: "top-right",
        autoClose: 2000,
      });
      setLabourCost("");
      return;
    }

    if (
      maintStartDate &&
      maintEndDate &&
      isBefore(maintEndDate, maintStartDate)
    ) {
      toast.error("Maintenance end date must be after or equal to start date", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }

    if (changeParts === "yes" && parts.length === 0) {
      toast.error("Please add parts if changing parts is selected", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("booking_id", location.state.id); // Adjust if API expects "id"
      formData.append("message", message);
      formData.append(
        "maintenance_start_date",
        maintStartDate ? format(maintStartDate, "yyyy-MM-dd") : ""
      );
      formData.append(
        "maintenance_end_date",
        maintEndDate ? format(maintEndDate, "yyyy-MM-dd") : ""
      );
      formData.append("change_part", parts.length > 0 ? "1" : "0");
      parts.forEach((part, index) => {
        formData.append(`service_fee[${index + 1}][name]`, part.name);
        formData.append(
          `service_fee[${index + 1}][price]`,
          part.totalPrice.toFixed(2)
        );
        formData.append(
          `service_fee[${index + 1}][quantity]`,
          part.quantity.toString()
        );
      });
      formData.append(
        "workmanship",
        (parseFloat(mainTotalCost) * 0.3).toFixed(2)
      );
      formData.append("total_amount", mainTotalCost);

      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      const response = await axios.post(
        `https://api.gapafix.com.ng/api/admin/bookings/${location.state.id}/quote`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Quote response:", response.data);
      toast.success("Quote generated successfully", {
        position: "top-right",
        autoClose: 2000,
      });
      localStorage.removeItem(`cartItems_${location.state.id}`);
      navigate("/dashboard");
    } catch (err) {
      console.error(
        "Failed to generate quote:",
        err.message,
        err.response?.data
      );
      let errorMessage = "Failed to generate quote";
      if (err.response?.status === 404) {
        errorMessage =
          "Booking not found or invalid endpoint. Please check the booking ID or contact support.";
      } else if (err.response?.status === 422 && err.response?.data?.errors) {
        errorMessage = Object.values(err.response.data.errors)
          .flat()
          .join(", ");
      } else if (err.response?.status === 401) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        navigate("/signin", { state: { from: window.location.pathname } });
      }
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleManualAdd = () => {
    setShowManualAdd(!showManualAdd);
  };

  const handleAddManualPart = () => {
    if (!manualPartName.trim()) {
      toast.error("Part name is required", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }
    const quantityNum = Number(manualQuantity);
    if (
      isNaN(quantityNum) ||
      quantityNum <= 0 ||
      !Number.isInteger(quantityNum)
    ) {
      toast.error("Quantity must be a positive integer", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }
    const unitPriceNum = Number(manualUnitPrice);
    if (isNaN(unitPriceNum) || unitPriceNum < 0) {
      toast.error("Unit price must be a positive number or zero", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }

    const newPart = {
      id: Date.now(),
      name: manualPartName.trim(),
      price: unitPriceNum,
      quantity: quantityNum,
      totalPrice: unitPriceNum * quantityNum,
    };

    setParts((prevParts) => [...prevParts, newPart]);
    toast.success(`Part "${newPart.name}" added`, {
      position: "top-right",
      autoClose: 2000,
    });

    setManualPartName("");
    setManualQuantity(1);
    setManualUnitPrice("");
    setShowManualAdd(false);
  };

  const handleDeletePart = (id) => {
    setParts((prevParts) => prevParts.filter((part) => part.id !== id));
    toast.info("Part removed", { position: "top-right", autoClose: 2000 });
  };

  return (
    <div className="w-full mx-auto p-6 bg-white overflow-y-auto custom-scrollbar">
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-[#333333] mb-4">Customer</h2>
        <div className="mb-4 max-w-4xl">
          <input
            type="text"
            className="w-full text-lg text-[#333333] font-semibold px-3 py-2 border border-[#E6E6E6] rounded-md bg-[#F9F9F9] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={customerName}
            readOnly
          />
        </div>
        <h2 className="text-lg font-semibold text-[#333333] mb-4">Details</h2>
        <div className="mb-6 max-w-4xl">
          <div className="flex flex-col md:flex-row space-y-4 items-center justify-between text-sm">
            <div className="flex items-center space-x-3 bg-[#F5CE4D] rounded-xl px-8 py-3 w-90">
              <img src={detail} alt="" />
              <div className="">
                <span className="text-gray-800 font-medium">
                  {location.state?.vehicle_type} {location.state?.vehicle_model}{" "}
                  - {location.state?.year_of_manufacture}
                </span>
                <h2 className="text-xs text-gray-600 mt-1">
                  Plate: {location.state?.vin_number?.slice(0, 8) || "N/A"} ·
                  Petrol · Automatic
                </h2>
              </div>
            </div>
            <div className="text-gray-700 text-left">
              <div className="text-sm">
                Fleet ID:{" "}
                <span className="font-medium">
                  {location.state?.booking_id || "N/A"}
                </span>
              </div>
              <div className="text-sm">
                Fleet Type:{" "}
                <span className="font-medium">
                  {location.state?.vehicle_type || "N/A"}
                </span>
              </div>
            </div>
            <div className="text-gray-700 text-right">
              <div className="text-sm">
                First Owner:{" "}
                <span className="font-medium">
                  {location.state?.created_at
                    ? format(new Date(location.state.created_at), "dd-MMM-yyyy")
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mb-8 max-w-3xl">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-base font-medium text-black mb-1">
              Maintenance Start Date
            </label>
            <div className="relative w-full">
              <DatePicker
                selected={maintStartDate}
                onChange={(date) => setMaintStartDate(date)}
                dateFormat="yyyy-MM-dd"
                placeholderText="Choose Start date"
                className="w-full px-3 py-2 border border-[#E6E6E6] bg-[#F9F9F9] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="w-full">
            <label className="block text-black font-medium text-base mb-1">
              Maintenance End Date
            </label>
            <div className="relative w-full">
              <DatePicker
                selected={maintEndDate}
                onChange={(date) => {
                  setMaintEndDate(date);
                  if (
                    date &&
                    maintStartDate &&
                    !isBefore(date, maintStartDate)
                  ) {
                    handleUpdateEndDate();
                  } else if (date) {
                    toast.error(
                      "Maintenance end date must be after or equal to start date",
                      {
                        position: "top-right",
                        autoClose: 2000,
                      }
                    );
                  }
                }}
                minDate={maintStartDate}
                dateFormat="yyyy-MM-dd"
                placeholderText="Choose End date"
                className="w-full px-3 py-2 border border-[#E6E6E6] bg-[#F9F9F9] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
        <div className="mb-4">
          <textarea
            placeholder="Message"
            className="w-full px-3 py-3 border border-[#BDBDBD] bg-[#FBF6F6] rounded-md text-sm h-30 overflow-auto resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <div className="relative mb-4">
          <select
            className="w-full px-3 py-2 border border-[#E6E6E6] rounded-md bg-[#F9F9F9] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            value={maintenanceType}
            onChange={(e) => setMaintenanceType(e.target.value)}
          >
            <option value="">Select Maintenance Type</option>
            {maintenanceOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-black font-medium text-base mb-1">
              Labour Cost
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-[#E6E6E6] rounded-md bg-[#F9F9F9] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={labourCost}
              onChange={(e) => setLabourCost(e.target.value)}
              placeholder="Enter labour cost"
            />
          </div>
          <div>
            <label className="block text-black font-medium text-base mb-1">
              Change Parts?
            </label>
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
          className="w-full bg-[#4B3193] text-white py-3 rounded-md text-sm font-medium hover:bg-[#3A256F] transition-colors mb-2"
        >
          Click here to choose part name
        </button>

        <div className="flex justify-start mb-4">
          <button
            type="button"
            onClick={toggleManualAdd}
            aria-label="Add part manually"
            className="flex items-center gap-1 text-[#4B3193] font-semibold hover:text-[#3A256F] focus:outline-none"
          >
            <Plus className="w-5 h-5" />
            <span>Add part manually</span>
          </button>
        </div>

        {showManualAdd && (
          <div className="mb-6 max-w-3xl bg-[#F9F9F9] p-4 rounded-md border border-[#E6E6E6]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Part name"
                className="w-full px-3 py-2 border border-[#E6E6E6] rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={manualPartName}
                onChange={(e) => setManualPartName(e.target.value)}
              />
              <input
                type="number"
                placeholder="Quantity"
                className="w-full px-3 py-2 border border-[#E6E6E6] rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={manualQuantity}
                min={1}
                step={1}
                onChange={(e) => setManualQuantity(e.target.value)}
              />
              <input
                type="number"
                placeholder="Unit price"
                className="w-full px-3 py-2 border border-[#E6E6E6] rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={manualUnitPrice}
                min={0}
                step="0.01"
                onChange={(e) => setManualUnitPrice(e.target.value)}
              />
            </div>
            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={handleAddManualPart}
                className="bg-[#4B3193] text-white py-2 px-6 rounded-md text-sm font-medium hover:bg-[#3A256F] transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        )}

        <div className="mb-4 max-w-3xl px-3 max-h-90 overflow-y-auto bg-[#F9F9F9] rounded-md border border-[#E6E6E6]">
          <div className="flex flex-wrap justify-between py-3 text-sm font-medium text-[#333333] border-b border-gray-300">
            <div className="flex-1">Part Name</div>
            <div className="flex-1">Unit Price</div>
            <div className="flex-1">Qty</div>
            <div className="flex-1">Total Price</div>
            <div className="w-8" />
          </div>
          {parts.length === 0 ? (
            <div className="py-8 text-center text-gray-400 text-sm">
              No parts added yet
            </div>
          ) : (
            parts.map((part) => (
              <div
                key={part.id}
                className="flex flex-wrap justify-between py-3 text-sm text-gray-600 items-center border-b border-gray-200 last:border-0"
              >
                <div className="flex-1">{part.name}</div>
                <div className="flex-1">₦{part.price.toLocaleString()}</div>
                <div className="flex-1">{part.quantity}</div>
                <div className="flex-1">
                  ₦{part.totalPrice.toLocaleString()}
                </div>
                <button
                  type="button"
                  onClick={() => handleDeletePart(part.id)}
                  className="text-gray-400 hover:text-red-600 p-1"
                  aria-label={`Delete part ${part.name}`}
                >
                  <Trash2 className="w-4 h-4 text-red-500 cursor-pointer" />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="max-w-3xl px-3 flex justify-end text-lg font-semibold text-black mb-8">
          <div>
            Total Cost (Parts + Labour):{" "}
            <span className="text-[#B80707]">
              ₦{parseFloat(mainTotalCost).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="w-full max-w-3xl flex justify-end mb-14 md:mb-0">
          <button
            type="button"
            onClick={handleGenerateQuote}
            disabled={isSubmitting}
            className={`w-full max-w-sm bg-[#B80707] text-white py-3 rounded-md font-medium transition-colors ${
              isSubmitting
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-red-700"
            }`}
          >
            {isSubmitting ? "Generating Quote..." : "GENERATE QUOTE"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quote;
