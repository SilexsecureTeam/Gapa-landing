import React, { useState, useEffect } from "react";
import {
  Car,
  Calendar,
  Wrench,
  AlertTriangle,
  Plus,
  Bell,
  Settings,
  FileText,
  LogOut,
} from "lucide-react";
import logo from "../assets/logo.png";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import AddVehicleModal from "./AddVehicleModal";

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

const VehicleDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedVehicle, setSelectedVehicle] = useState(0);
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [upcomingMaintenance, setUpcomingMaintenance] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [isTransactionsLoading, setIsTransactionsLoading] = useState(false);
  const navigate = useNavigate();

  const getDaysRemaining = async (vehicleId, bookingId) => {
    console.log(
      "getDaysRemaining called for vehicleId:",
      vehicleId,
      "bookingId:",
      bookingId
    );

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.warn("No auth token for API fetch");
        return {
          daysRemaining: null,
          paymentStatus: "Payment Pending",
          total_amount: 0,
        };
      }

      const response = await axios.get(
        `https://api.gapafix.com.ng/api/booking/${vehicleId}/invoice/view`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      let invoiceData =
        response.data.quote || response.data.data || response.data || {};
      if (typeof invoiceData === "string") {
        console.warn("Invoice data is string, attempting to parse...");
        try {
          invoiceData = JSON.parse(invoiceData);
        } catch {
          console.error("Failed to parse invoice data");
          return {
            daysRemaining: null,
            paymentStatus: "Payment Pending",
            total_amount: 0,
          };
        }
      }

      const paymentStatus = invoiceData.status || "Payment Pending";
      const total_amount = parseFloat(invoiceData.total_amount) || 0;
      console.log(
        `VehicleId: ${vehicleId}, BookingId: ${bookingId}, PaymentStatus: ${paymentStatus}, TotalAmount: ${total_amount}`
      );
      const maintenanceEndDate = invoiceData.maintenance_end_date || "N/A";

      if (
        !["success", "paid"].includes(paymentStatus) ||
        !maintenanceEndDate ||
        maintenanceEndDate === "N/A"
      ) {
        console.log(
          `No valid payment or maintenance_end_date for vehicleId ${vehicleId}. Status: ${paymentStatus}, End Date: ${maintenanceEndDate}`
        );
        return {
          daysRemaining: null,
          paymentStatus: "Payment Pending",
          total_amount,
        };
      }

      const endDate = new Date(maintenanceEndDate);
      const today = new Date();
      if (isNaN(endDate.getTime())) {
        console.warn("Invalid maintenance_end_date:", maintenanceEndDate);
        return { daysRemaining: null, paymentStatus: "Paid", total_amount };
      }

      const daysRemaining = Math.ceil(
        (endDate - today) / (1000 * 60 * 60 * 24)
      );
      console.log(
        "Days remaining for vehicleId",
        vehicleId,
        ":",
        daysRemaining
      );
      return {
        daysRemaining: daysRemaining >= 0 ? daysRemaining : 0,
        paymentStatus: "Paid",
        total_amount,
      };
    } catch (err) {
      console.error(`Failed to fetch invoice for vehicleId ${vehicleId}:`, err);
      return {
        daysRemaining: null,
        paymentStatus: "Payment Pending",
        total_amount: 0,
      };
    }
  };

  useEffect(() => {
    const fetchOrdersAndQuotes = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("Please log in to view vehicles.", {
          action: { label: "Log In", onClick: () => navigate("/signin") },
        });
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          "https://api.gapafix.com.ng/api/orders",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const fetchedVehicles = response.data.data || [];
        const vehiclesData = await Promise.all(
          fetchedVehicles.map(async (v) => {
            const numericalId = parseInt(v.id);
            const { daysRemaining, paymentStatus, total_amount } = isNaN(
              numericalId
            )
              ? {
                  daysRemaining: null,
                  paymentStatus: "Payment Pending",
                  total_amount: 0,
                }
              : await getDaysRemaining(numericalId, v.booking_id);
            return {
              id: v.id || Date.now(),
              booking_id: v.booking_id || "N/A",
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
              total_amount,
              daysRemaining,
              paymentStatus,
            };
          })
        );
        setVehicles(vehiclesData);

        const maintenanceData = [];
        for (const vehicle of vehiclesData) {
          const numericalId = parseInt(vehicle.id);
          if (isNaN(numericalId) || numericalId <= 0) {
            console.error(`Invalid vehicle ID: ${vehicle.id}`);
            continue;
          }
          try {
            const quoteResponse = await axios.get(
              `https://api.gapafix.com.ng/api/booking/${numericalId}/invoice/view`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            let quoteData = quoteResponse.data.data || quoteResponse.data || {};
            if (typeof quoteData === "string") {
              console.warn(
                `Invoice data for ID ${numericalId} is a string, expected JSON object. Using fallback.`
              );
              quoteData = {};
            }
            if (quoteData.maintenance_start_date) {
              const dueDate = new Date(quoteData.maintenance_start_date);
              const today = new Date();
              const dueInDays = Math.ceil(
                (dueDate - today) / (1000 * 60 * 60 * 24)
              );
              (quoteData.service_fee || []).forEach((part) => {
                maintenanceData.push({
                  type: part.name,
                  dueIn: dueInDays >= 0 ? `${dueInDays} days` : "Overdue",
                  icon: <Wrench className="w-4 h-4" />,
                  booking_id: vehicle.booking_id,
                });
              });
            }
          } catch (err) {
            console.error(
              `Error fetching quote for booking ID ${numericalId}:`,
              {
                _message: err.message,
                status: err.response?.status,
                data: err.response?.data,
              }
            );
          }
        }
        setUpcomingMaintenance(maintenanceData);
      } catch (err) {
        console.error("Error fetching orders", err);
        if (err.response?.status === 401) {
          localStorage.removeItem("authToken");
          toast.error("Session expired. Please log in again.", {
            action: { label: "Log In", onClick: () => navigate("/signin") },
          });
        } else {
          toast.error("Failed to load vehicles. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrdersAndQuotes();
  }, [navigate]);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (activeTab !== "track-history") return;

      setIsTransactionsLoading(true);
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("Please log in to view transactions.", {
          action: { label: "Log In", onClick: () => navigate("/signin") },
        });
        setIsTransactionsLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          "https://api.gapafix.com.ng/api/user/transactions",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const transactionData = response.data.data || [];
        console.log("Fetched transactions:", transactionData);
        console.log(
          "Selected vehicle booking_id:",
          vehicles[selectedVehicle]?.booking_id
        );
        // Log filtered transactions
        const filteredTransactions = transactionData.filter((tx) => {
          const extractedBookingId = tx.reference?.startsWith("booking_Gapafix")
            ? tx.reference.split("_")[1]
            : null;
          return (
            tx.booking_id === vehicles[selectedVehicle]?.booking_id ||
            extractedBookingId === vehicles[selectedVehicle]?.booking_id
          );
        });
        console.log("Filtered transactions:", filteredTransactions);
        setTransactions(transactionData);
      } catch (err) {
        console.error("Error fetching transactions:", {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
        });
        if (err.response?.status === 401) {
          localStorage.removeItem("authToken");
          toast.error("Session expired. Please log in again.", {
            action: { label: "Log In", onClick: () => navigate("/signin") },
          });
        } else {
          toast.error("Failed to load transactions. Please try again.");
        }
      } finally {
        setIsTransactionsLoading(false);
      }
    };
    fetchTransactions();
  }, [activeTab, navigate, vehicles, selectedVehicle]);

  const handleLogout = async () => {
    const token = localStorage.getItem("authToken");
    try {
      await axios.post(
        "https://api.gapafix.com.ng/api/logout",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      localStorage.removeItem("authToken");
      toast.success("Logged out successfully!");
      navigate("/signin");
    } catch (err) {
      console.error("Error logging out:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      if (err.response?.status === 401) {
        localStorage.removeItem("authToken");
        toast.error("Session expired. Please log in again.", {
          action: { label: "Log In", onClick: () => navigate("/signin") },
        });
      } else {
        toast.error("Failed to log out. Please try again.");
      }
    }
  };

  const handleViewInvoice = () => {
    const vehicle = vehicles[selectedVehicle];
    const numericalId = parseInt(vehicle?.id);
    if (!vehicle || isNaN(numericalId) || numericalId <= 0) {
      toast.error("No valid booking ID available for this vehicle.");
      return;
    }
    navigate(`/booking/${numericalId}/invoice`, {
      state: { ...vehicle },
    });
  };

  return (
    <div className="min-h-screen bg-white w-full py-6 lg:px-20 md:px-16 sm:px-12 px-4">
      <header className="bg-[#F2F2F2] rounded-xl mb-3">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <img src={logo} alt="CarFlex Logo" className="h-12" />
              </Link>
              <div className="">
                <h2 className="text-lg font-semibold text-[#575757]">
                  Dear {vehicles[selectedVehicle]?.full_name || "N/A"}
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
                onClick={() => setIsAddVehicleOpen(true)}
                className="flex items-center space-x-2 cursor-pointer bg-[#492F92] text-white px-4 py-2 rounded-lg hover:bg-[#3b2371] transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Vehicle</span>
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

      <div className="w-full mx-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#F4F4F4] border border-[#EBEBEB] rounded-xl p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6">
                <div>
                  <h1 className="text-xl font-semibold text-[#575757]">
                    My Vehicles
                  </h1>
                  <p className="text-[#575757] text-sm">
                    Manage multiple cars and book services per vehicle
                  </p>
                </div>
                <button
                  onClick={() =>
                    navigate("/book-service", {
                      state: {
                        selectedVehicleId: vehicles[selectedVehicle]?.id,
                      },
                    })
                  }
                  className="mt-4 sm:mt-0 bg-[#492F92] text-white px-4 py-2 rounded-full text-sm hover:bg-[#3b2371] flex items-center space-x-2 transition-colors"
                >
                  <Wrench className="w-4 h-4" />
                  <span>Book Service</span>
                </button>
              </div>
              {isLoading ? (
                <div className="text-center py-6">
                  <p className="text-gray-500 text-sm">Loading vehicles...</p>
                </div>
              ) : vehicles.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-500 text-sm">
                    No vehicles found. Add a vehicle to get started.
                  </p>
                  <button
                    onClick={() => setIsAddVehicleOpen(true)}
                    className="mt-4 bg-[#492F92] text-white px-4 py-2 rounded-full text-sm hover:bg-[#3b2371]"
                  >
                    Add Vehicle
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-50 overflow-y-auto">
                  {vehicles.map((vehicle, index) => (
                    <div
                      key={vehicle.id}
                      className={`rounded-xl px-4 py-3 sm:px-6 sm:py-4 border border-[#EBEBEB] transition-all cursor-pointer hover:shadow-lg ${
                        selectedVehicle === index ? "bg-[#F7CD3A]" : ""
                      }`}
                      onClick={() => setSelectedVehicle(index)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="bg-amber-100 p-2 rounded-lg">
                            <Car className="w-6 h-6 text-amber-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                              {vehicle.vehicle_type} {vehicle.make}{" "}
                              {vehicle.model}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-500">
                              VIN: {vehicle.vin_number}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-500">
                              Booking ID: {vehicle.booking_id || "N/A"}
                            </p>
                            {vehicle.daysRemaining !== null &&
                            vehicle.daysRemaining !== undefined ? (
                              <p className="text-xs sm:text-sm text-[#492F92] font-semibold">
                                Next Service In: {vehicle.daysRemaining} days
                              </p>
                            ) : (
                              <p className="text-xs sm:text-sm text-gray-500 hidden">
                                Awaiting payment or quote
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <nav className="flex flex-wrap gap-2 sm:gap-0 px-4 sm:px-6">
              {[
                { id: "overview", label: "Overview" },
                { id: "service-history", label: "Service History" },
                { id: "track-history", label: "Track History" },
                { id: "report", label: "Report" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 px-2 sm:py-4 sm:px-1 border max-w-36 w-full border-[#EBEBEB] font-medium text-xs sm:text-sm transition-colors ${
                    activeTab === tab.id
                      ? "bg-[#575757] text-white"
                      : "text-gray-500"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
            <div>
              {activeTab === "overview" && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex flex-col sm:flex-row sm:space-x-5 sm:items-start">
                    <div className="bg-[#F4F4F4] rounded-lg p-4 flex-1">
                      <h3 className="text-base font-semibold text-[#575757]">
                        Vehicle Summary
                      </h3>
                      <p className="text-[#575757] text-sm mb-4">
                        Key details for {vehicles[selectedVehicle]?.make}{" "}
                        {vehicles[selectedVehicle]?.model}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-sm font-medium text-gray-600">
                              Vehicle Type
                            </span>
                          </div>
                          <p className="font-semibold text-gray-900 text-sm">
                            {vehicles[selectedVehicle]?.vehicle_type || "N/A"}
                          </p>
                        </div>
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-sm font-medium text-gray-600">
                              Vehicle Make
                            </span>
                          </div>
                          <p className="font-semibold text-gray-900 text-sm">
                            {vehicles[selectedVehicle]?.make || "N/A"}
                          </p>
                        </div>
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-sm font-medium text-gray-600">
                              Vehicle Model
                            </span>
                          </div>
                          <p className="font-semibold text-gray-900 text-sm">
                            {vehicles[selectedVehicle]?.model || "N/A"}
                          </p>
                        </div>
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-sm font-medium text-gray-600">
                              VIN Number
                            </span>
                          </div>
                          <p className="font-semibold text-gray-900 text-sm">
                            {vehicles[selectedVehicle]?.vin_number || "N/A"}
                          </p>
                        </div>
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-sm font-medium text-gray-600">
                              Year of Manufacture
                            </span>
                          </div>
                          <p className="font-semibold text-gray-900 text-sm">
                            {vehicles[selectedVehicle]?.year || "N/A"}
                          </p>
                        </div>
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-sm font-medium text-gray-600">
                              Phone
                            </span>
                          </div>
                          <p className="font-semibold text-gray-900 text-sm">
                            {vehicles[selectedVehicle]?.phone || "N/A"}
                          </p>
                        </div>
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-sm font-medium text-gray-600">
                              Email
                            </span>
                          </div>
                          <p className="font-semibold text-gray-900 text-sm">
                            {vehicles[selectedVehicle]?.email || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2 mt-4 sm:mt-0 flex-1 items-center">
                      <div className="bg-[#F4F4F4] rounded-lg p-4 flex-1">
                        <h3 className="text-base font-semibold text-[#575757]">
                          Ongoing / Upcoming
                        </h3>
                        <p className="text-[#575757] text-sm mb-4">
                          Track your current booking
                        </p>
                        <div className="bg-[#F4F4F4] rounded-lg p-4 sm:p-6 border border-[#EBEBEB]">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold text-[#575757] mb-2 text-sm sm:text-base">
                                {vehicles[selectedVehicle]?.service_required ||
                                  "Full Service"}{" "}
                                with{" "}
                                {vehicles[selectedVehicle]?.service_center ||
                                  "Prime Auto Care"}
                              </h4>
                              <div className="flex items-center space-x-2 text-sm text-[#575757] mb-1">
                                <Calendar className="w-4 h-4" />
                                <p>
                                  {vehicles[selectedVehicle]?.service_date ||
                                    "2025-09-10"}{" "}
                                  {vehicles[selectedVehicle]?.service_time ||
                                    "10:00"}
                                </p>
                              </div>
                            </div>
                            <button
                              className={`inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium 
    ${
      vehicles[selectedVehicle]?.paymentStatus?.toLowerCase() === "paid"
        ? "bg-green-100 text-green-800"
        : vehicles[selectedVehicle]?.paymentStatus?.toLowerCase() ===
          "scheduled"
        ? "bg-yellow-100 text-yellow-800"
        : "bg-orange-100 text-orange-800"
    }`}
                            >
                              {vehicles[selectedVehicle]?.paymentStatus ||
                                "Payment Pending"}
                            </button>
                          </div>
                        </div>
                      </div>
                      {vehicles[selectedVehicle]?.daysRemaining !== null &&
                      vehicles[selectedVehicle]?.daysRemaining !== undefined ? (
                        <p className="text-lg text-[#492F92] bg-[#F4F4F4] rounded-lg p-4 font-semibold">
                          Next Service In:{" "}
                          {vehicles[selectedVehicle]?.daysRemaining} days
                        </p>
                      ) : (
                        <p className="text-lg text-[#492F92] bg-[#F4F4F4] rounded-lg p-4 font-semibold hidden">
                          Awaiting payment or quote
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
              {activeTab === "service-history" && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="bg-[#F4F4F4] rounded-lg p-4">
                    <h3 className="text-base font-semibold text-[#575757]">
                      Service History
                    </h3>
                    <p className="text-[#575757] text-sm mb-4">
                      Service details for {vehicles[selectedVehicle]?.make}{" "}
                      {vehicles[selectedVehicle]?.model}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-sm font-medium text-gray-600">
                            Service Required
                          </span>
                        </div>
                        <p className="font-semibold text-gray-900 text-sm">
                          {vehicles[selectedVehicle]?.service_required || "N/A"}
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-sm font-medium text-gray-600">
                            Additional Services
                          </span>
                        </div>
                        {vehicles[selectedVehicle]?.additional_services
                          ?.length ? (
                          <ul className="list-disc pl-5 space-y-1">
                            {vehicles[selectedVehicle].additional_services.map(
                              (service, index) => (
                                <li
                                  key={index}
                                  className="text-sm font-semibold text-gray-900 marker:text-[#492F92]"
                                >
                                  {service}
                                </li>
                              )
                            )}
                          </ul>
                        ) : (
                          <p className="text-sm font-semibold text-gray-900">
                            None
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === "track-history" && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="bg-[#F4F4F4] rounded-lg p-4">
                    <h3 className="text-base font-semibold text-[#575757]">
                      Transaction History
                    </h3>
                    <p className="text-[#575757] text-sm mb-4">
                      Payment details for {vehicles[selectedVehicle]?.make}{" "}
                      {vehicles[selectedVehicle]?.model}
                    </p>
                    {isTransactionsLoading ? (
                      <div className="text-center py-6">
                        <p className="text-gray-500 text-sm">
                          Loading transactions...
                        </p>
                      </div>
                    ) : transactions.length === 0 ? (
                      <div className="text-center py-6">
                        <p className="text-gray-500 text-sm">
                          No transactions found for this vehicle.
                        </p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-900">
                          <thead className="text-xs text-gray-600 uppercase bg-[#EBEBEB]">
                            <tr>
                              <th scope="col" className="px-4 py-3">
                                Booking ID
                              </th>
                              <th scope="col" className="px-4 py-3">
                                Amount
                              </th>
                              <th scope="col" className="px-4 py-3">
                                Currency
                              </th>
                              <th scope="col" className="px-4 py-3">
                                Status
                              </th>
                              <th scope="col" className="px-4 py-3">
                                Paid At
                              </th>
                              <th scope="col" className="px-4 py-3">
                                Payment Channel
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {transactions
                              .filter((tx) => {
                                // Extract GapafixXXXX from reference
                                const extractedBookingId =
                                  tx.reference?.startsWith("booking_Gapafix")
                                    ? tx.reference.split("_")[1]
                                    : null;
                                return (
                                  tx.booking_id ===
                                    vehicles[selectedVehicle]?.booking_id ||
                                  extractedBookingId ===
                                    vehicles[selectedVehicle]?.booking_id
                                );
                              })
                              .map((tx, index) => (
                                <tr
                                  key={index}
                                  className="border-b border-[#EBEBEB]"
                                >
                                  <td className="px-4 py-3">
                                    {tx.booking_id || "N/A"}
                                  </td>
                                  <td className="px-4 py-3">
                                    {tx.currency === "NGN"
                                      ? formatNaira(parseFloat(tx.amount) || 0)
                                      : tx.amount || "N/A"}
                                  </td>
                                  <td className="px-4 py-3">
                                    {tx.currency || "N/A"}
                                  </td>
                                  <td className="px-4 py-3">
                                    <span
                                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                        tx.status?.toLowerCase() === "success"
                                          ? "bg-green-100 text-green-800"
                                          : tx.status?.toLowerCase() ===
                                            "pending"
                                          ? "bg-yellow-100 text-yellow-800"
                                          : "bg-red-100 text-red-800"
                                      }`}
                                    >
                                      {tx.status || "N/A"}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3">
                                    {tx.paid_at
                                      ? new Date(
                                          tx.paid_at
                                        ).toLocaleDateString()
                                      : "N/A"}
                                  </td>
                                  <td className="px-4 py-3">
                                    {tx.payment_channel || "N/A"}
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {activeTab === "report" && (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-sm">
                    Content for Report will be displayed here
                  </p>
                </div>
              )}
            </div>
            <div className="rounded-xl border border-[#EBEBEB] p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-[#575757] mb-2">
                Spend Overview
              </h3>
              <p className="text-[#575757] mb-4 text-sm">
                Total spent on this vehicle
              </p>
              <div className="flex items-center justify-between p-4 sm:p-6">
                <p className="text-2xl sm:text-3xl font-bold text-[#575757]">
                  {formatNaira(vehicles[selectedVehicle]?.total_amount || 0)}
                </p>
                <button
                  onClick={handleViewInvoice}
                  className="bg-[#575757] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full hover:bg-gray-900 transition-colors text-sm"
                >
                  View Invoice
                </button>
              </div>
            </div>
          </div>
          <div className="space-y-4 sm:space-y-6 hidden lg:block">
            <div className="bg-[#F4F4F4] rounded-xl shadow-sm p-4 sm:p-6">
              <div className="flex items-center space-x-4 mb-2">
                <Bell className="w-5 h-5 text-[#575757]" />
                <h3 className="text-base font-semibold text-[#575757]">
                  Upcoming Maintenance
                </h3>
              </div>
              <p className="text-[#575757] text-sm mb-4">
                Get reminder notifications based on mileage and last service
              </p>
              {upcomingMaintenance.length === 0 ? (
                <h3 className="text-lg font-medium text-[#575757] mb-2">
                  No upcoming maintenance yet.
                </h3>
              ) : (
                <div className="space-y-3">
                  {upcomingMaintenance.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 rounded-lg transition-colors"
                    >
                      <div className="text-gray-400 bg-[#EBEBEB] p-2">
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">
                          {item.type} (Booking #{item.booking_id})
                        </p>
                        <p className="text-gray-500 text-xs">
                          Due in {item.dueIn}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="bg-white rounded-xl border border-[#EBEBEB] p-4 sm:p-6">
              <h3 className="text-lg font-medium text-[#575757] mb-2">
                Our experienced service centers
              </h3>
              <p className="text-[#575757] text-sm mb-4">
                Top class workshops & expert mechanics
              </p>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
                  <h4 className="font-semibold text-[#575757] mb-1">
                    Prime Auto Care
                  </h4>
                  <p className="text-[#575757] text-sm mb-2">
                    Lekki Phase 1 · Workshop
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
                  <h4 className="font-semibold text-[#575757] mb-1">
                    RoadPro Mobile Mechanics
                  </h4>
                  <p className="text-[#575757] text-sm mb-2">
                    Victoria Island · Mobile
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:hidden mt-4 space-y-4">
          <div className="bg-[#F4F4F4] rounded-xl shadow-sm p-4">
            <div className="flex items-center space-x-4 mb-2">
              <Bell className="w-5 h-5 text-[#575757]" />
              <h3 className="text-base font-semibold text-[#575757]">
                Upcoming Maintenance
              </h3>
            </div>
            <p className="text-[#575757] text-sm mb-4">
              Get reminder notifications based on mileage and last service
            </p>
            {upcomingMaintenance.length === 0 ? (
              <h3 className="text-lg font-medium text-[#575757] mb-2">
                No upcoming maintenance yet.
              </h3>
            ) : (
              <div className="space-y-3">
                {upcomingMaintenance.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 rounded-lg transition-colors"
                  >
                    <div className="text-gray-400 bg-[#EBEBEB] p-2">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">
                        {item.type} (Booking #{item.booking_id})
                      </p>
                      <p className="text-gray-500 text-xs">
                        Due in {item.dueIn}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="bg-white rounded-xl border border-[#EBEBEB] p-4">
            <h3 className="text-lg font-medium text-[#575757] mb-2">
              Our experienced service centers
            </h3>
            <p className="text-[#575757] text-sm mb-4">
              Top class workshops & expert mechanics
            </p>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
                <h4 className="font-semibold text-[#575757] mb-1">
                  Prime Auto Care
                </h4>
                <p className="text-[#575757] text-sm mb-2">
                  Lekki Phase 1 · Workshop
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
                <h4 className="font-semibold text-[#575757] mb-1">
                  RoadPro Mobile Mechanics
                </h4>
                <p className="text-[#575757] text-sm mb-2">
                  Victoria Island · Mobile
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AddVehicleModal
        isOpen={isAddVehicleOpen}
        onClose={() => setIsAddVehicleOpen(false)}
        setVehicles={setVehicles}
      />
    </div>
  );
};

export default VehicleDashboard;
