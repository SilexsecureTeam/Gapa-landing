import React, { useState, useEffect } from "react";
import { Eye, Trash2, ArrowDownUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Overview = () => {
  const [maintenanceData, setMaintenanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const user = localStorage.getItem("user");
    if (!token || !user) {
      setError("User is not authenticated. Please sign in.");
      navigate("/signin", { state: { from: window.location.pathname } });
      return;
    }

    let userRole;
    try {
      userRole = JSON.parse(user).role;
      if (userRole !== "admin") {
        setError("Only admins can access this page.");
        navigate("/dashboard");
        return;
      }
    } catch {
      setError("Invalid user data. Please sign in again.");
      navigate("/signin", { state: { from: window.location.pathname } });
      return;
    }

    const fetchBookingsAndQuotes = async () => {
      try {
        const response = await axios.get(
          "https://api.gapafix.com.ng/api/bookings/all",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.status) {
          const bookings = response.data.data.map((item) => ({
            ...item,
            id: parseInt(item.id),
            maintenance_end_date: item.maintenance_end_date || null,
            total_amount: item.total_amount
              ? parseFloat(item.total_amount)
              : null,
          }));

          // Fetch quote data for each booking
          const updatedBookings = await Promise.all(
            bookings.map(async (booking) => {
              try {
                const quoteResponse = await axios.get(
                  `https://api.gapafix.com.ng/api/booking/${booking.id}/invoice/view`,
                  { headers: { Authorization: `Bearer ${token}` } }
                );
                let quoteData =
                  quoteResponse.data.data ||
                  quoteResponse.data.quote ||
                  quoteResponse.data;

                // Handle potential text response
                if (typeof quoteResponse.data === "string") {
                  const parseTextToJson = (text) => {
                    const lines = text
                      .split("\n")
                      .map((line) => line.trim())
                      .filter((line) => line);
                    const json = { service_fee: [] };
                    let currentPart = null;
                    lines.forEach((line) => {
                      if (line.startsWith("Booking ID:"))
                        json.booking_id = line.split(": ")[1];
                      else if (line.startsWith("Customer:")) {
                        const [name, email] = line.split(": ")[1].split(" (");
                        json.full_name = name;
                        json.email = email ? email.replace(")", "") : "";
                      } else if (line.startsWith("- ")) {
                        currentPart = { name: line.slice(2) };
                        json.service_fee.push(currentPart);
                      } else if (line.startsWith("Price:") && currentPart) {
                        currentPart.price =
                          parseFloat(line.split(": ₦")[1].replace(",", "")) ||
                          0;
                      } else if (line.startsWith("Qty:") && currentPart) {
                        currentPart.quantity =
                          parseInt(line.split(": ")[1]) || 1;
                        currentPart.subtotal =
                          currentPart.price * currentPart.quantity;
                      } else if (line.startsWith("Workmanship:")) {
                        json.workmanship =
                          parseFloat(line.split(": ₦")[1].replace(",", "")) ||
                          0;
                      } else if (line.startsWith("Total:")) {
                        json.total_amount =
                          parseFloat(line.split(": ₦")[1].replace(",", "")) ||
                          0;
                      } else if (line.startsWith("Maintenance Start Date:")) {
                        json.maintenance_start_date = line.split(": ")[1];
                      } else if (line.startsWith("Maintenance End Date:")) {
                        json.maintenance_end_date = line.split(": ")[1];
                      } else if (line.startsWith("Message:")) {
                        json.message = line.split(": ")[1];
                      } else if (line.startsWith("Change Part:")) {
                        json.change_part =
                          line.split(": ")[1].toLowerCase() === "yes";
                      }
                    });
                    return json;
                  };
                  quoteData = parseTextToJson(quoteResponse.data);
                }

                if (quoteData && Object.keys(quoteData).length > 0) {
                  return {
                    ...booking,
                    maintenance_end_date:
                      quoteData.maintenance_end_date ||
                      booking.maintenance_end_date,
                    total_amount: quoteData.total_amount
                      ? parseFloat(quoteData.total_amount)
                      : booking.total_amount,
                    status: quoteData.status || booking.status || "Pending",
                  };
                }
                return booking;
              } catch (err) {
                if (err.response?.status === 404) {
                  console.log(`No quote found for booking ID: ${booking.id}`);
                  return booking;
                } else {
                  console.error(
                    `Error fetching quote for booking ${booking.id}:`,
                    err.message,
                    err.response?.data
                  );
                  return booking;
                }
              }
            })
          );

          setMaintenanceData(updatedBookings);
        } else {
          setError("Failed to retrieve bookings");
        }
      } catch (err) {
        console.error(
          "Error fetching bookings:",
          err.message,
          err.response?.data
        );
        if (err.response?.status === 401) {
          setError("Session expired. Please sign in again.");
          localStorage.removeItem("authToken");
          localStorage.removeItem("user");
          navigate("/signin", { state: { from: window.location.pathname } });
        } else {
          setError("Error fetching bookings: " + err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBookingsAndQuotes();
  }, [navigate]);

  const handleView = (item) => {
    navigate(`/dashboard/quote/${encodeURIComponent(item.id)}`, {
      state: { ...item },
    });
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("authToken");
    const user = localStorage.getItem("user");
    if (!token || !user) {
      toast.error("User is not authenticated. Please sign in.", {
        position: "top-right",
        autoClose: 2000,
      });
      navigate("/signin", { state: { from: window.location.pathname } });
      return;
    }

    let userRole;
    try {
      userRole = JSON.parse(user).role;
      if (userRole !== "admin") {
        toast.error("Only admins can delete bookings.", {
          position: "top-right",
          autoClose: 2000,
        });
        return;
      }
    } catch {
      toast.error("Invalid user data. Please sign in again.", {
        position: "top-right",
        autoClose: 2000,
      });
      navigate("/signin", { state: { from: window.location.pathname } });
      return;
    }

    try {
      await axios.delete(
        `https://api.gapafix.com.ng/api/admin/bookings/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMaintenanceData((prev) => prev.filter((item) => item.id !== id));
      toast.success("Booking deleted successfully", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (err) {
      console.error(
        "Failed to delete booking:",
        err.message,
        err.response?.data
      );
      let errorMessage = "Failed to delete booking";
      if (err.response?.status === 401) {
        errorMessage = "Session expired. Please sign in again.";
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        navigate("/signin", { state: { from: window.location.pathname } });
      } else if (err.response?.status === 403) {
        errorMessage = "Only admins can delete bookings.";
      } else if (err.response?.status === 404) {
        errorMessage = "Booking not found.";
      } else if (err.message.includes("Network Error")) {
        errorMessage = "Network error: Unable to connect to the server.";
      }
      toast.error(errorMessage, { position: "top-right", autoClose: 2000 });
    }
  };

  if (loading) {
    return (
      <div className="w-full bg-white flex justify-center items-center h-64">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-white flex justify-center items-center h-64">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white overflow-hidden">
      <div className="overflow-x-auto scrollbar-hide">
        <table className="w-full min-w-[600px] border-separate border-spacing-y-2">
          <thead>
            <tr className="bg-white">
              <th className="text-left py-3 px-4 font-semibold text-[#333333] text-sm">
                Fleet Name
              </th>
              <th className="text-left py-3 px-4 font-semibold text-[#333333] text-sm">
                <div className="inline-flex items-center gap-1">
                  <ArrowDownUp size={16} className="text-gray-600" /> Start Date
                </div>
              </th>
              <th className="text-left py-3 px-4 font-semibold text-[#333333] text-sm">
                <div className="inline-flex items-center gap-1">
                  <ArrowDownUp size={16} className="text-gray-600" /> End Date
                </div>
              </th>
              <th className="text-left py-3 px-4 font-semibold text-[#333333] text-sm w-70">
                <div className="inline-flex items-center gap-1">
                  <ArrowDownUp size={16} className="text-gray-600" />{" "}
                  Maintenance Type
                </div>
              </th>
              <th className="text-left py-3 px-4 font-semibold text-[#333333] text-sm">
                <div className="inline-flex items-center gap-1">
                  <ArrowDownUp size={16} className="text-gray-600" /> Total Cost
                </div>
              </th>
              <th className="text-left py-3 px-4 font-semibold text-[#333333] text-sm">
                Status
              </th>
              <th className="text-left py-3 px-4 font-semibold text-[#333333] text-sm w-20"></th>
            </tr>
          </thead>
          <tbody>
            {maintenanceData.map((item, index) => (
              <tr
                key={item.id}
                className={`border-b bg-[#F9F9F9] border-[#E0E0E0] hover:bg-gray-50 transition-colors ${
                  index === maintenanceData.length - 1 ? "border-b-0" : ""
                }`}
              >
                <td className="py-4 px-4 text-sm text-gray-900 font-medium">
                  {item.booking_id || "N/A"}
                </td>
                <td className="py-4 px-4 text-sm text-gray-600">
                  {item.service_date
                    ? new Date(item.service_date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "N/A"}
                </td>
                <td className="py-4 px-4 text-sm text-gray-600">
                  {item.maintenance_end_date
                    ? new Date(item.maintenance_end_date).toLocaleDateString(
                        "en-GB",
                        { day: "2-digit", month: "short", year: "numeric" }
                      )
                    : "-"}
                </td>
                <td className="py-4 px-4 text-sm text-gray-600 w-70">
                  {item.service_required
                    ? `${item.service_required}${
                        item.additional_services &&
                        item.additional_services.length > 0
                          ? `, ${item.additional_services.join(", ")}`
                          : ""
                      }`
                    : item.additional_services &&
                      item.additional_services.length > 0
                    ? item.additional_services.join(", ")
                    : "N/A"}
                </td>
                <td className="py-4 px-4 text-sm text-gray-900 font-medium">
                  {item.total_amount != null
                    ? `₦${item.total_amount.toLocaleString()}`
                    : "-"}
                </td>
                <td className="py-4 px-4 text-sm">
                  {(() => {
                    const status = item.status?.toLowerCase();
                    let bgColor = "bg-yellow-100";
                    let textColor = "text-yellow-800";

                    if (status === "success") {
                      bgColor = "bg-green-100";
                      textColor = "text-green-800";
                    } else if (status === "scheduled") {
                      bgColor = "bg-blue-100";
                      textColor = "text-blue-800";
                    } else if (status === "payment_pending") {
                      bgColor = "bg-orange-100";
                      textColor = "text-orange-800";
                    }

                    return (
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}
                      >
                        {item.status || "Pending"}
                      </span>
                    );
                  })()}
                </td>

                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleView(item)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Eye size={16} className="text-green-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <style>{`
        @media (max-width: 640px) {
          table {
            font-size: 0.85rem;
          }
          th,
          td {
            padding: 0.5rem;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        }
      `}</style>
    </div>
  );
};

export default Overview;
