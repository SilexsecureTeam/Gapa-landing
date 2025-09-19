// src/components/Dashboard/Overview.jsx
import React, { useState, useEffect } from "react";
import { Eye, Trash2, ArrowDownUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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

    const fetchBookings = async () => {
      try {
        const response = await axios.get(
          "https://api.gapafix.com.ng/api/bookings/all",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.status) {
          setMaintenanceData(response.data.data);
        } else {
          setError("Failed to retrieve bookings");
        }
      } catch (err) {
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

    fetchBookings();
  }, [navigate]);

  const handleView = (item) => {
    navigate(`/dashboard/quote/${encodeURIComponent(item.booking_id)}`, {
      state: { ...item, booking_id: item.booking_id },
    });
    console.log("Navigating to Quote for:", item);
  };

  const handleDelete = (id) => {
    console.log(`Delete booking with id: ${id}`);
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
                  <ArrowDownUp size={16} className="text-gray-600" />
                  Start Date
                </div>
              </th>
              <th className="text-left py-3 px-4 font-semibold text-[#333333] text-sm">
                <div className="inline-flex items-center gap-1">
                  <ArrowDownUp size={16} className="text-gray-600" />
                  End Date
                </div>
              </th>
              <th className="text-left py-3 px-4 font-semibold text-[#333333] text-sm w-70">
                <div className="inline-flex items-center gap-1">
                  <ArrowDownUp size={16} className="text-gray-600" />
                  Maintenance Type
                </div>
              </th>
              <th className="text-left py-3 px-4 font-semibold text-[#333333] text-sm">
                <div className="inline-flex items-center gap-1">
                  <ArrowDownUp size={16} className="text-gray-600" />
                  Total Cost
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
                  {item.service_date || "N/A"}
                </td>
                <td className="py-4 px-4 text-sm text-gray-600">-</td>
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
                  -
                </td>
                <td className="py-4 px-4 text-sm">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Pending
                  </span>
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

      <style jsx>{`
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
