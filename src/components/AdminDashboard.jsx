import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Settings, LogOut, X } from "lucide-react";
import logo from "../assets/logo.png";

const formatNaira = (number) => {
  return Number(number)
    .toLocaleString("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    .replace("NGN", "₦");
};

const AdminDashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState("");
  const [form, setForm] = useState({
    message: "",
    maintenance_start_date: "",
    maintenance_end_date: "",
    service_fee: "",
    workmanship: "",
    total_amount: "",
  });
  const [parts, setParts] = useState([]);
  const [newPart, setNewPart] = useState({
    change_part: "",
    unit_price: "",
    quantity: "",
  });
  const navigate = useNavigate();

  // Fetch all bookings
  useEffect(() => {
    const fetchAllBookings = async () => {
      const token = localStorage.getItem("authToken");
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!token) {
        toast.error("Please log in to access the admin dashboard.", {
          action: { label: "Log In", onClick: () => navigate("/signin") },
        });
        setIsLoading(false);
        return;
      }
      if (!user.role || user.role !== "admin") {
        toast.error("You do not have permission to view all vehicles.");
        navigate("/vehicle-dashboard");
        setIsLoading(false);
        return;
      }
      try {
        const response = await axios.get(
          "https://api.gapafix.com.ng/api/bookings/all",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const fetchedBookings = response.data.data || [];
        // Filter unique by vin_number
        const uniqueVehicles = [];
        const seenVins = new Set();
        fetchedBookings.forEach((v) => {
          if (!seenVins.has(v.vin_number)) {
            seenVins.add(v.vin_number);
            uniqueVehicles.push({
              id: v.id || Date.now(), // numeric id here
              booking_id: v.booking_id || "N/A", // string booking code here
              vehicle_type: v.vehicle_type || "N/A",
              make: v.vehicle_make || "N/A",
              model: v.vehicle_model || "N/A",
              vin_number: v.vin_number || "N/A",
              full_name: v.full_name || "N/A",
              year: v.year_of_manufacture || "N/A",
              service_required: v.service_required || "N/A",
              service_center: v.service_center || "N/A",
              additional_services: v.additional_services || [],
              service_date: v.service_date || "N/A",
              service_time: v.service_time || "N/A",
              phone: v.phone || "N/A",
              email: v.email || "N/A",
              user_id: v.user_id || "N/A",
              status: v.status || "N/A",
              created_at: v.created_at || "N/A",
              updated_at: v.updated_at || "N/A",
              total_amount: v.total_amount || 0,
            });
          }
        });
        setVehicles(uniqueVehicles);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("user");
          toast.error("Session expired. Please log in again.", {
            action: { label: "Log In", onClick: () => navigate("/signin") },
          });
        } else if (err.response?.status === 403) {
          toast.error("You do not have permission to view all vehicles.");
          navigate("/vehicle-dashboard");
        } else {
          toast.error("Failed to load vehicles. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllBookings();
  }, [navigate]);

  // Calculate total_amount
  useEffect(() => {
    const partsTotal = parts.reduce(
      (sum, part) =>
        sum +
        (parseFloat(part.unit_price) || 0) * (parseInt(part.quantity) || 0),
      0
    );
    const serviceFee = parseFloat(form.service_fee) || 0;
    const workmanship = parseFloat(form.workmanship) || 0;
    setForm((prev) => ({
      ...prev,
      total_amount: (partsTotal + serviceFee + workmanship).toFixed(2),
    }));
  }, [parts, form.service_fee, form.workmanship]);

  const handleLogout = async () => {
    const token = localStorage.getItem("authToken");
    try {
      await axios.post(
        "https://api.gapafix.com.ng/api/logout",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      toast.success("Logged out successfully!");
      navigate("/signin");
    } catch {
      toast.error("Failed to log out. Please try again.");
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePartChange = (e) => {
    const { name, value } = e.target;
    setNewPart((prev) => ({ ...prev, [name]: value }));
  };

  const addPart = () => {
    if (!newPart.change_part || !newPart.unit_price || !newPart.quantity) {
      toast.error("Please fill in all part fields.");
      return;
    }
    setParts((prev) => [...prev, { ...newPart }]);
    setNewPart({ change_part: "", unit_price: "", quantity: "" });
  };

  const removePart = (index) => {
    setParts((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBooking) {
      toast.error("Please select a booking.");
      return;
    }
    if (!form.maintenance_start_date || !form.maintenance_end_date) {
      toast.error("Please fill in all required fields.");
      return;
    }
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Please log in to generate a quote.", {
        action: { label: "Log In", onClick: () => navigate("/signin") },
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const selectedVehicle = vehicles.find(
        (v) => v.booking_id === selectedBooking
      );
      if (!selectedVehicle) {
        toast.error("Selected vehicle not found.");
        setIsSubmitting(false);
        return;
      }
      const payload = {
        booking_id: selectedBooking, // string booking code for payload
        user_booking_id: selectedVehicle.user_id, // numeric user id
        message: form.message || "Quote for maintenance",
        maintenance_start_date: form.maintenance_start_date,
        maintenance_end_date: form.maintenance_end_date,
        change_part: parts.length > 0,
        parts: parts.map((part) => ({
          name: part.change_part,
          unit_price: parseFloat(part.unit_price) || 0,
          quantity: parseInt(part.quantity) || 0,
        })),
        service_fee: [
          {
            name: "Service Fee",
            price: parseFloat(form.service_fee) || 0,
            quantity: 1,
          },
        ],
        workmanship: parseFloat(form.workmanship) || 0,
        total_amount: parseFloat(form.total_amount) || 0,
      };
      // Use the numeric internal id for the URL instead of string booking_id
      const primaryEndpoint = `https://api.gapafix.com.ng/api/admin/bookings/${selectedVehicle.id}/quote`;
      console.log("Quote payload:", JSON.stringify(payload, null, 2));
      console.log(`Sending POST to ${primaryEndpoint}`);

      const response = await axios.post(primaryEndpoint, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      toast.success("Quote generated successfully!");
      navigate("/admin-dashboard", {
        state: {
          quoteData: {
            booking_id: selectedBooking,
            vehicle: `${selectedVehicle.vehicle_type} ${selectedVehicle.make} ${selectedVehicle.model}`,
            total_amount: form.total_amount,
            quote_id: response.data?.id || selectedBooking,
          },
        },
      });

      setForm({
        message: "",
        maintenance_start_date: "",
        maintenance_end_date: "",
        service_fee: "",
        workmanship: "",
        total_amount: "",
      });
      setParts([]);
      setSelectedBooking("");
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        toast.error("Session expired. Please log in again.", {
          action: { label: "Log In", onClick: () => navigate("/signin") },
        });
      } else if (err.response?.status === 404) {
        toast.error(
          err.response?.data?.message ||
            "Quote endpoint or booking ID not found. Please check the API URL or contact support."
        );
      } else {
        toast.error(err.response?.data?.message || "Failed to generate quote.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-6 lg:px-20 md:px-16 sm:px-12 px-4">
      <header className="bg-[#F2F2F2] rounded-xl mb-3">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <img src={logo} alt="CarFlex Logo" className="h-12" />
              <div>
                <h2 className="text-lg font-semibold text-[#575757]">
                  Dear {vehicles[0]?.full_name || "Admin"}
                </h2>
              </div>
            </div>
            <div className="flex items-center space-x-4 sm:space-x-10">
              <button
                onClick={() => navigate("/profile-change")}
                className="flex items-center space-x-2 text-black hover:text-gray-900 transition-colors"
              >
                <Settings className="w-5 h-5" />
                <span className="hidden sm:inline">Profile</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center text-red-500 space-x-2 hover:text-red-700 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="rounded-xl p-4 sm:p-6">
          {isLoading ? (
            <div className="text-center py-6">
              <p className="text-gray-500 text-sm">Loading vehicles...</p>
            </div>
          ) : vehicles.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-gray-500 text-sm">No vehicles found.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-medium text-[#575757]">
                    Select Vehicle
                  </h2>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedBooking("");
                      setForm({
                        message: "",
                        maintenance_start_date: "",
                        maintenance_end_date: "",
                        service_fee: "",
                        workmanship: "",
                        total_amount: "",
                      });
                      setParts([]);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    Clear Selection
                  </button>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vehicle<span className="text-[#FF0000]">*</span>
                  </label>
                  <select
                    value={selectedBooking}
                    onChange={(e) => setSelectedBooking(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#EBEBEB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#492F92]"
                  >
                    <option value="">Select a vehicle</option>
                    {vehicles.map((vehicle) => (
                      <option key={vehicle.id} value={vehicle.booking_id}>
                        {vehicle.vehicle_type} {vehicle.make} {vehicle.model} -{" "}
                        {vehicle.full_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {selectedBooking && (
                <div className="bg-yellow-100 rounded-lg p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center sm:space-x-4">
                  <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center mb-3 sm:mb-0">
                    <span className="text-white text-sm font-bold">
                      {vehicles.find((v) => v.booking_id === selectedBooking)
                        ?.vehicle_type[0] || "N/A"}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-[#575757]">
                      {vehicles.find((v) => v.booking_id === selectedBooking)
                        ?.vehicle_type || "N/A"}{" "}
                      {vehicles.find((v) => v.booking_id === selectedBooking)
                        ?.make || "N/A"}{" "}
                      {vehicles.find((v) => v.booking_id === selectedBooking)
                        ?.model || "N/A"}
                    </div>
                    <div className="text-sm text-gray-600">
                      {vehicles.find((v) => v.booking_id === selectedBooking)
                        ?.service_required || "N/A"}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mt-2 sm:mt-0 sm:text-right">
                    <div>Booking ID: {selectedBooking}</div>
                    <div>
                      Owner:{" "}
                      {vehicles.find((v) => v.booking_id === selectedBooking)
                        ?.full_name || "N/A"}
                    </div>
                    <div>
                      VIN:{" "}
                      {vehicles.find((v) => v.booking_id === selectedBooking)
                        ?.vin_number || "N/A"}
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <h2 className="text-base font-medium text-[#575757]">
                    Quote Details
                  </h2>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleFormChange}
                      disabled={isSubmitting}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#EBEBEB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#492F92]"
                      rows="4"
                      placeholder="Enter a message for the quote"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Maintenance Start Date
                        <span className="text-[#FF0000]">*</span>
                      </label>
                      <input
                        type="date"
                        name="maintenance_start_date"
                        value={form.maintenance_start_date}
                        onChange={handleFormChange}
                        required
                        min={new Date().toISOString().split("T")[0]}
                        disabled={isSubmitting}
                        className="w-full px-3 py-2 text-sm bg-white border border-[#EBEBEB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#492F92]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Maintenance End Date
                        <span className="text-[#FF0000]">*</span>
                      </label>
                      <input
                        type="date"
                        name="maintenance_end_date"
                        value={form.maintenance_end_date}
                        onChange={handleFormChange}
                        required
                        min={
                          form.maintenance_start_date ||
                          new Date().toISOString().split("T")[0]
                        }
                        disabled={isSubmitting}
                        className="w-full px-3 py-2 text-sm bg-white border border-[#EBEBEB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#492F92]"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Service Fee
                      </label>
                      <input
                        type="number"
                        name="service_fee"
                        value={form.service_fee}
                        onChange={handleFormChange}
                        disabled={isSubmitting}
                        className="w-full px-3 py-2 text-sm bg-white border border-[#EBEBEB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#492F92]"
                        placeholder="Enter service fee"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Workmanship
                      </label>
                      <input
                        type="number"
                        name="workmanship"
                        value={form.workmanship}
                        onChange={handleFormChange}
                        disabled={isSubmitting}
                        className="w-full px-3 py-2 text-sm bg-white border border-[#EBEBEB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#492F92]"
                        placeholder="Enter workmanship cost"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Part Name
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="change_part"
                          value={newPart.change_part}
                          onChange={handlePartChange}
                          disabled={isSubmitting}
                          className="w-full px-3 py-2 text-sm bg-white border border-[#EBEBEB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#492F92]"
                          placeholder="Enter part name"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Unit Price
                      </label>
                      <input
                        type="number"
                        name="unit_price"
                        value={newPart.unit_price}
                        onChange={handlePartChange}
                        disabled={isSubmitting}
                        className="w-full px-3 py-2 text-sm bg-white border border-[#EBEBEB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#492F92]"
                        placeholder="Enter price"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quantity
                      </label>
                      <input
                        type="number"
                        name="quantity"
                        value={newPart.quantity}
                        onChange={handlePartChange}
                        disabled={isSubmitting}
                        className="w-full px-3 py-2 text-sm bg-white border border-[#EBEBEB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#492F92]"
                        placeholder="Enter quantity"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={addPart}
                    disabled={isSubmitting}
                    className="w-full bg-[#492F92] text-white py-2 rounded-md text-sm font-medium hover:bg-[#3b2371] transition-colors disabled:opacity-50"
                  >
                    Add Part
                  </button>
                  {parts.length > 0 && (
                    <div className="mt-4">
                      <div className="bg-gray-50 rounded-t-md p-3 grid grid-cols-4 text-sm font-medium text-[#575757]">
                        <div>Part Name</div>
                        <div>Unit Price</div>
                        <div>Quantity</div>
                        <div>Total Price</div>
                      </div>
                      <div className="border border-t-0 border-[#EBEBEB] rounded-b-md">
                        {parts.map((part, index) => (
                          <div
                            key={index}
                            className="grid grid-cols-4 p-3 text-sm text-gray-700 border-b border-[#EBEBEB] last:border-b-0"
                          >
                            <div>{part.change_part}</div>
                            <div>{formatNaira(part.unit_price)}</div>
                            <div>{part.quantity}</div>
                            <div>
                              {formatNaira(
                                (
                                  parseFloat(part.unit_price) *
                                  parseInt(part.quantity)
                                ).toFixed(2)
                              )}
                              <button
                                onClick={() => removePart(index)}
                                className="ml-2 text-red-500 hover:text-red-700"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total Amount
                    </label>
                    <input
                      type="text"
                      name="total_amount"
                      value={formatNaira(form.total_amount)}
                      disabled
                      className="w-full px-3 py-2 text-sm bg-gray-200 border border-[#EBEBEB] rounded-md text-gray-500 cursor-not-allowed"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-green-600 text-white py-3 rounded-md text-base font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? "Generating..." : "Generate Quote"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
