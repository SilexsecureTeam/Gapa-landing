import React, { useState, useEffect } from "react";
import { ArrowDownUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import { toast } from "react-toastify";

const Customers = () => {
  const [customerData, setCustomerData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 9;
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

    const fetchCustomers = async () => {
      try {
        const response = await axios.get(
          "https://api.gapafix.com.ng/api/bookings/all",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.status) {
          // Deduplicate customers by email
          const bookings = response.data.data;
          const customerMap = new Map();
          bookings.forEach((booking) => {
            const customer = {
              full_name: booking.full_name || "N/A",
              email: booking.email || "N/A",
              phone: booking.phone || "N/A", // Adjust if phone is not available
              created_at: booking.created_at || null,
              status: booking.status || "Active", // Derive from booking or assume Active
            };
            // Use email as key to avoid duplicates
            if (!customerMap.has(customer.email)) {
              customerMap.set(customer.email, customer);
            }
          });
          const customers = Array.from(customerMap.values());
          setCustomerData(customers);
        } else {
          setError("Failed to retrieve customers");
        }
      } catch (err) {
        console.error(
          "Error fetching customers:",
          err.message,
          err.response?.data
        );
        if (err.response?.status === 401) {
          setError("Session expired. Please sign in again.");
          localStorage.removeItem("authToken");
          localStorage.removeItem("user");
          navigate("/signin", { state: { from: window.location.pathname } });
        } else {
          setError("Error fetching customers: " + err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [navigate]);

  // Pagination logic
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = customerData.slice(
    indexOfFirstCustomer,
    indexOfLastCustomer
  );
  const totalPages = Math.ceil(customerData.length / customersPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
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
                Name
              </th>
              <th className="text-left py-3 px-4 font-semibold text-[#333333] text-sm">
                Email
              </th>
              <th className="text-left py-3 px-4 font-semibold text-[#333333] text-sm">
                Phone
              </th>
              <th className="text-left py-3 px-4 font-semibold text-[#333333] text-sm">
                <div className="inline-flex items-center gap-1">
                  <ArrowDownUp size={16} className="text-gray-600" />{" "}
                  Registration Date
                </div>
              </th>
              <th className="text-left py-3 px-4 font-semibold text-[#333333] text-sm">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {currentCustomers.map((customer, index) => (
              <tr
                key={customer.email} // Use email as key since ID is removed
                className={`border-b bg-[#F9F9F9] border-[#E0E0E0] hover:bg-gray-50 transition-colors ${
                  index === currentCustomers.length - 1 ? "border-b-0" : ""
                }`}
              >
                <td className="py-4 px-4 text-sm text-gray-600">
                  {customer.full_name}
                </td>
                <td className="py-4 px-4 text-sm text-gray-600">
                  {customer.email}
                </td>
                <td className="py-4 px-4 text-sm text-gray-600">
                  {customer.phone}
                </td>
                <td className="py-4 px-4 text-sm text-gray-600">
                  {customer.created_at
                    ? new Date(customer.created_at).toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )
                    : "N/A"}
                </td>
                <td className="py-4 px-4 text-sm">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    {customer.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {customerData.length > customersPerPage && (
        <div className="flex justify-end mt-4 space-x-2">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              currentPage === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-[#4B3193] text-white hover:bg-[#3A256F]"
            }`}
          >
            Previous
          </button>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-[#4B3193] text-white hover:bg-[#3A256F]"
            }`}
          >
            Next
          </button>
        </div>
      )}
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

export default Customers;
