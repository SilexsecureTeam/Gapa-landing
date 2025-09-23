import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  Calendar,
  Plus,
  Trash2,
  PlusCircle,
  MinusCircle,
} from "lucide-react";
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
  const [quoteId, setQuoteId] = useState(null); // New state to track quote ID

  const partsTotal = parts.reduce(
    (sum, part) => sum + (part.totalPrice || 0),
    0
  );
  const mainTotalCost = (partsTotal + (parseFloat(labourCost) || 0)).toFixed(2);

  const isFormValid = () =>
    maintenanceType &&
    maintStartDate &&
    maintEndDate &&
    changeParts &&
    labourCost &&
    message &&
    parseFloat(labourCost) >= 0 &&
    (changeParts !== "yes" || parts.length > 0) &&
    (!maintStartDate ||
      !maintEndDate ||
      !isBefore(maintEndDate, maintStartDate));

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const user = localStorage.getItem("user");

    if (!token || !user) {
      toast.error("Please sign in to access this page.", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/signin", { state: { from: window.location.pathname } });
      return;
    }

    let userRole;
    try {
      userRole = JSON.parse(user).role;
      if (userRole !== "admin") {
        toast.error("Only admins can access this page.", {
          position: "top-right",
          autoClose: 3000,
        });
        navigate("/dashboard");
        return;
      }
    } catch {
      toast.error("Invalid user data. Please sign in again.", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/signin", { state: { from: window.location.pathname } });
      return;
    }

    if (location.state) {
      console.log("location.state:", location.state);
      const {
        service_date,
        service_required,
        additional_services,
        full_name,
        selectedParts,
        id,
      } = location.state;

      const numericalId = parseInt(id);
      if (!id || isNaN(numericalId)) {
        console.error("Invalid or missing booking ID:", id);
        toast.error(
          "Invalid or missing booking ID. Please select a valid booking.",
          {
            position: "top-right",
            autoClose: 3000,
          }
        );
        navigate("/dashboard");
        return;
      }

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

      const savedCart = localStorage.getItem(`cartItems_${numericalId}`);
      const cartItems = savedCart ? JSON.parse(savedCart) : [];
      const newParts = (selectedParts || cartItems || []).map((part) => ({
        id: part.id,
        name: part.name,
        price: parseFloat(part.price) || 0,
        quantity: parseInt(part.quantity) || 1,
        totalPrice: parseFloat(part.totalPrice) || 0,
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
      const numericalId = parseInt(location.state.id);
      if (!isNaN(numericalId)) {
        localStorage.setItem(`cartItems_${numericalId}`, JSON.stringify(parts));
      }
    }
  }, [parts, location.state]);

  const handleAddFleet = () => {
    const numericalId = parseInt(location.state?.id);
    if (!numericalId || isNaN(numericalId)) {
      toast.error("Invalid booking ID.", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }
    navigate(`/dashboard/quote/${encodeURIComponent(fleetName)}/add-fleet`, {
      state: {
        fleetName,
        customerName,
        maintenanceType,
        labourCost,
        maintStartDate,
        maintEndDate,
        id: numericalId,
      },
    });
  };

  const handleUpdateEndDate = async () => {
    const token = localStorage.getItem("authToken");
    const numericalId = parseInt(location.state?.id);
    if (!token || !numericalId || isNaN(numericalId) || !maintEndDate) return;

    if (maintStartDate && isBefore(maintEndDate, maintStartDate)) {
      toast.error("Maintenance end date must be after or equal to start date", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }

    try {
      await axios.patch(
        `https://api.gapafix.com.ng/api/bookings/${numericalId}`,
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

  const checkQuoteExists = async (bookingId) => {
    const token = localStorage.getItem("authToken");
    const numericalId = parseInt(bookingId);
    if (!token || isNaN(numericalId)) return false;

    try {
      const response = await axios.get(
        `https://api.gapafix.com.ng/api/booking/${numericalId}/invoice/view`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(
        "Check quote response:",
        JSON.stringify(response.data, null, 2)
      );
      const quoteExists =
        response.data.status &&
        response.data.data &&
        Object.keys(response.data.data).length > 0;
      if (quoteExists) {
        setQuoteId(response.data.data.id); // Set quoteId if quote exists
      }
      return quoteExists;
    } catch (err) {
      if (err.response?.status === 404) {
        return false;
      }
      if (
        err.response?.data?.status === false &&
        err.response?.data?.message ===
          "A quote already exists for this booking"
      ) {
        return true;
      }
      console.error("Error checking quote:", err.message, err.response?.data);
      return false;
    }
  };

  const validateBookingId = async (id) => {
    const token = localStorage.getItem("authToken");
    const numericalId = parseInt(id);
    if (isNaN(numericalId)) {
      console.error("Invalid booking ID format:", id);
      return false;
    }
    try {
      const response = await axios.get(
        "https://api.gapafix.com.ng/api/bookings/all",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const exists = response.data.data.some(
        (booking) => booking.id === numericalId
      );
      console.log(`Booking ${numericalId} exists in all bookings?`, exists);
      return exists;
    } catch (err) {
      console.error("Validation failed:", err.message, err.response?.data);
      return false;
    }
  };

  const handleGenerateQuote = async () => {
    const token = localStorage.getItem("authToken");
    const bookingId = parseInt(location.state?.id);
    const booking_id = location.state?.booking_id || "N/A";

    if (!token || !bookingId || isNaN(bookingId)) {
      toast.error("Missing or invalid booking ID", {
        position: "top-right",
        autoClose: 2000,
      });
      navigate("/dashboard");
      return;
    }

    const isValidBooking = await validateBookingId(bookingId);
    if (!isValidBooking) {
      toast.error(`Invalid or non-existent booking ID: ${booking_id}`, {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const quoteExists = await checkQuoteExists(bookingId);
    if (quoteExists) {
      toast.warn(`A quote already exists for booking #${booking_id}`, {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (!maintenanceType) {
      toast.error("Maintenance type is required", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }
    if (!maintStartDate) {
      toast.error("Maintenance start date is required", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }
    if (!maintEndDate) {
      toast.error("Maintenance end date is required", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }
    if (!changeParts) {
      toast.error("Please select whether to change parts", {
        position: "top-right",
        autoClose: 2000,
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
      formData.append("booking_id", booking_id);
      formData.append("message", message);
      formData.append(
        "maintenance_start_date",
        format(maintStartDate, "yyyy-MM-dd")
      );
      formData.append(
        "maintenance_end_date",
        format(maintEndDate, "yyyy-MM-dd")
      );
      formData.append("change_part", parts.length > 0 ? "1" : "0");
      parts.forEach((part, index) => {
        formData.append(`service_fee[${index + 1}][name]`, part.name);
        formData.append(
          `service_fee[${index + 1}][price]`,
          part.price.toFixed(2)
        );
        formData.append(
          `service_fee[${index + 1}][quantity]`,
          part.quantity.toString()
        );
      });
      formData.append("workmanship", parseFloat(labourCost).toFixed(2));
      formData.append("total_amount", mainTotalCost);

      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      const response = await axios.post(
        `https://api.gapafix.com.ng/api/admin/bookings/${bookingId}/quote`,
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

      setQuoteId(response.data.data.id); // Store the quote ID from response

      localStorage.setItem(
        `updatedBooking_${bookingId}`,
        JSON.stringify({
          id: bookingId,
          maintenance_end_date: format(maintEndDate, "yyyy-MM-dd"),
          total_amount: parseFloat(mainTotalCost),
        })
      );
    } catch (err) {
      console.error(
        "Failed to generate quote:",
        err.message,
        err.response?.data
      );
      let errorMessage = "Failed to generate quote";
      if (
        err.response?.data?.status === false &&
        err.response?.data?.message ===
          "A quote already exists for this booking"
      ) {
        toast.warn(`A quote already exists for booking #${booking_id}`, {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      } else if (err.response?.status === 404) {
        errorMessage =
          "Booking not found or invalid endpoint. Please check the booking ID or contact support.";
      } else if (err.response?.status === 422 && err.response?.data?.errors) {
        errorMessage = Object.values(err.response.data.errors)
          .flat()
          .join(", ");
      } else if (err.response?.status === 401) {
        errorMessage = "Session expired. Please sign in again.";
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

  const handleEditQuote = async () => {
    const token = localStorage.getItem("authToken");
    const bookingId = parseInt(location.state?.id);
    const booking_id = location.state?.booking_id || "N/A";

    if (!token || !bookingId || isNaN(bookingId)) {
      toast.error("Missing or invalid booking ID", {
        position: "top-right",
        autoClose: 2000,
      });
      navigate("/dashboard");
      return;
    }

    if (!quoteId) {
      toast.error("No quote ID available for editing", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }

    if (!maintenanceType) {
      toast.error("Maintenance type is required", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }
    if (!maintStartDate) {
      toast.error("Maintenance start date is required", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }
    if (!maintEndDate) {
      toast.error("Maintenance end date is required", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }
    if (!changeParts) {
      toast.error("Please select whether to change parts", {
        position: "top-right",
        autoClose: 2000,
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
      formData.append("_method", "PATCH"); // Add _method: PATCH for Laravel
      formData.append("booking_id", booking_id);
      formData.append("message", message);
      formData.append(
        "maintenance_start_date",
        format(maintStartDate, "yyyy-MM-dd")
      );
      formData.append(
        "maintenance_end_date",
        format(maintEndDate, "yyyy-MM-dd")
      );
      formData.append("change_part", parts.length > 0 ? "1" : "0");
      parts.forEach((part, index) => {
        formData.append(`service_fee[${index + 1}][name]`, part.name);
        formData.append(
          `service_fee[${index + 1}][price]`,
          part.price.toFixed(2)
        );
        formData.append(
          `service_fee[${index + 1}][quantity]`,
          part.quantity.toString()
        );
      });
      formData.append("workmanship", parseFloat(labourCost).toFixed(2));
      formData.append("total_amount", mainTotalCost);

      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      const response = await axios.post(
        `https://api.gapafix.com.ng/api/quotes/${quoteId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Edit quote response:", response.data);
      toast.success("Quote updated successfully", {
        position: "top-right",
        autoClose: 2000,
      });

      localStorage.setItem(
        `updatedBooking_${bookingId}`,
        JSON.stringify({
          id: bookingId,
          maintenance_end_date: format(maintEndDate, "yyyy-MM-dd"),
          total_amount: parseFloat(mainTotalCost),
        })
      );
    } catch (err) {
      console.error("Failed to edit quote:", err.message, err.response?.data);
      let errorMessage = "Failed to edit quote";
      if (err.response?.status === 404) {
        errorMessage = "Quote not found. Please check the quote ID.";
      } else if (err.response?.status === 422 && err.response?.data?.errors) {
        errorMessage = Object.values(err.response.data.errors)
          .flat()
          .join(", ");
      } else if (err.response?.status === 401) {
        errorMessage = "Session expired. Please sign in again.";
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

  const handleUpdateQuantity = (partId, change) => {
    setParts((prevParts) =>
      prevParts.map((part) => {
        if (part.id === partId) {
          const newQuantity = Math.max(1, part.quantity + change);
          return {
            ...part,
            quantity: newQuantity,
            totalPrice: part.price * newQuantity,
          };
        }
        return part;
      })
    );
    toast.info(`Quantity updated`, {
      position: "top-right",
      autoClose: 2000,
    });
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
              Maintenance Start Date <span className="text-red-500">*</span>
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
              Maintenance End Date <span className="text-red-500">*</span>
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
          <label className="block text-black font-medium text-base mb-1">
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            placeholder="Message"
            className="w-full px-3 py-3 border border-[#BDBDBD] bg-[#FBF6F6] rounded-md text-sm h-30 overflow-auto resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <div className="relative mb-4">
          <label className="block text-black font-medium text-base mb-1">
            Maintenance Type <span className="text-red-500">*</span>
          </label>
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
              Labour Cost <span className="text-red-500">*</span>
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
              Change Parts? <span className="text-red-500">*</span>
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
                <div className="flex-1 flex items-center gap-2">
                  <button
                    onClick={() => handleUpdateQuantity(part.id, -1)}
                    className="p-1 hover:bg-gray-100 rounded"
                    aria-label={`Decrease quantity for ${part.name}`}
                  >
                    <MinusCircle className="w-4 h-4 text-gray-600" />
                  </button>
                  <span>{part.quantity}</span>
                  <button
                    onClick={() => handleUpdateQuantity(part.id, 1)}
                    className="p-1 hover:bg-gray-100 rounded"
                    aria-label={`Increase quantity for ${part.name}`}
                  >
                    <PlusCircle className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
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
            onClick={quoteId ? handleEditQuote : handleGenerateQuote}
            disabled={isSubmitting || !isFormValid()}
            className={`w-full max-w-sm bg-[#B80707] text-white py-3 rounded-md font-medium transition-colors ${
              isSubmitting || !isFormValid()
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-red-700"
            }`}
          >
            {isSubmitting
              ? quoteId
                ? "Updating Quote..."
                : "Generating Quote..."
              : quoteId
              ? "EDIT QUOTE"
              : "GENERATE QUOTE"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quote;
