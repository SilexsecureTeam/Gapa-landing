import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FileText, Download, ArrowLeft } from "lucide-react";
import logo from "../assets/logo.png";

// Custom number formatter for Naira (e.g., ₦20,000.00)
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

const Invoice = () => {
  const [invoice, setInvoice] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const navigate = useNavigate();
  const { bookingId } = useParams();

  // Fetch all bookings to get numeric id
  useEffect(() => {
    const fetchAllBookings = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("Please log in to view the invoice.", {
          action: { label: "Log In", onClick: () => navigate("/signin") },
        });
        setIsLoading(false);
        return;
      }

      let isMounted = true;
      try {
        const response = await axios.get("/api/bookings/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(
          "Bookings response:",
          JSON.stringify(response.data, null, 2)
        );
        const fetchedBookings = response.data.data || [];
        const uniqueVehicles = [];
        const seenVins = new Set();
        fetchedBookings.forEach((v) => {
          if (!seenVins.has(v.vin_number)) {
            seenVins.add(v.vin_number);
            uniqueVehicles.push({
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
              status: v.status || "N/A",
            });
          }
        });
        if (isMounted) {
          setVehicles(uniqueVehicles);
          console.log(
            "Available booking IDs:",
            uniqueVehicles.map((v) => ({ booking_id: v.booking_id, id: v.id }))
          );
        }
      } catch (err) {
        console.error("Error fetching bookings:", {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
        });
        if (isMounted) {
          if (err.response?.status === 401) {
            localStorage.removeItem("authToken");
            localStorage.removeItem("user");
            toast.error("Session expired. Please log in again.", {
              action: { label: "Log In", onClick: () => navigate("/signin") },
            });
          } else {
            toast.error(
              "Failed to load bookings. Invoice may not display correctly."
            );
          }
        }
      }
      return () => {
        isMounted = false;
      };
    };
    fetchAllBookings();
  }, [navigate]);

  // Fetch invoice
  useEffect(() => {
    const selectedVehicle = vehicles.find((v) => v.booking_id === bookingId);

    const fetchInvoice = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("Please log in to view the invoice.", {
          action: { label: "Log In", onClick: () => navigate("/signin") },
        });
        setIsLoading(false);
        return;
      }

      if (vehicles.length > 0 && !selectedVehicle) {
        toast.error(`Booking ID ${bookingId} not found.`);
        setIsLoading(false);
        return;
      }

      let isMounted = true;
      setIsLoading(true);

      const id = selectedVehicle?.id || bookingId;
      try {
        console.log(
          "Fetching invoice for bookingId:",
          bookingId,
          "numeric id:",
          id
        );

        const response = await axios.get(`/api/booking/${id}/invoice/view`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(
          "Invoice response:",
          JSON.stringify(response.data, null, 2)
        );

        if (isMounted) {
          const invoiceData = response.data.data || response.data || {};
          if (Object.keys(invoiceData).length === 0) {
            console.warn("Invoice data is empty:", invoiceData);
            toast.warn("No invoice data returned from server.");
          }
          setInvoice(invoiceData);
        }
      } catch (err) {
        console.error("Error fetching invoice:", {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
        });
        if (isMounted) {
          if (err.message.includes("Network Error")) {
            toast.error(
              "CORS error: Server is blocking requests. Please contact the backend team to enable CORS for http://localhost:5173."
            );
          } else if (err.response?.status === 401) {
            localStorage.removeItem("authToken");
            localStorage.removeItem("user");
            toast.error("Session expired. Please log in again.", {
              action: { label: "Log In", onClick: () => navigate("/signin") },
            });
          } else if (err.response?.status === 404 && id !== bookingId) {
            toast.error(
              `Invoice for numeric ID ${id} not found. Trying booking ID...`
            );
            try {
              const fallbackResponse = await axios.get(
                `/api/booking/${bookingId}/invoice/view`,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              console.log(
                "Fallback invoice response:",
                JSON.stringify(fallbackResponse.data, null, 2)
              );
              if (isMounted) {
                const fallbackData =
                  fallbackResponse.data.data || fallbackResponse.data || {};
                if (Object.keys(fallbackData).length === 0) {
                  console.warn("Fallback invoice data is empty:", fallbackData);
                  toast.warn("No invoice data returned from fallback request.");
                }
                setInvoice(fallbackData);
              }
            } catch (fallbackErr) {
              console.error("Fallback error:", {
                message: fallbackErr.message,
                status: fallbackErr.response?.status,
                data: fallbackErr.response?.data,
              });
              if (isMounted) {
                toast.error(
                  fallbackErr.response?.data?.message ||
                    "Failed to load invoice with booking ID."
                );
              }
            }
          } else {
            toast.error(
              err.response?.data?.message ||
                "Failed to load invoice. Please try again."
            );
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }

      return () => {
        isMounted = false;
      };
    };

    if (bookingId) {
      fetchInvoice();
    }
  }, [bookingId, vehicles, navigate]);

  const handleDownload = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Please log in to download the invoice.", {
        action: { label: "Log In", onClick: () => navigate("/signin") },
      });
      return;
    }

    const selectedVehicle = vehicles.find((v) => v.booking_id === bookingId);
    if (vehicles.length > 0 && !selectedVehicle) {
      toast.error(`Booking ID ${bookingId} not found.`);
      return;
    }

    let isMounted = true;
    setIsDownloading(true);

    try {
      const id = selectedVehicle?.id || bookingId;
      console.log(
        "Downloading invoice for bookingId:",
        bookingId,
        "numeric id:",
        id
      );

      const response = await axios.get(`/api/booking/${id}/invoice/download`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });
      console.log("Download response:", {
        status: response.status,
        headers: response.headers,
      });

      if (isMounted) {
        if (response.headers["content-type"] !== "application/pdf") {
          throw new Error("Invalid PDF response");
        }
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `invoice_${bookingId}.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        toast.success("Invoice downloaded successfully!");
      }
    } catch (err) {
      console.error("Error downloading invoice:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
      if (isMounted) {
        if (err.message.includes("Network Error")) {
          toast.error(
            "CORS error: Server is blocking requests. Please contact the backend team to enable CORS for http://localhost:5173."
          );
        } else if (err.response?.status === 401) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("user");
          toast.error("Session expired. Please log in again.", {
            action: { label: "Log In", onClick: () => navigate("/signin") },
          });
        } else if (err.response?.status === 404) {
          toast.error(`Invoice for booking ID ${bookingId} not found.`);
        } else {
          toast.error(
            err.response?.data?.message ||
              "Failed to download invoice. Please try again."
          );
        }
      }
    } finally {
      if (isMounted) {
        setIsDownloading(false);
      }
    }

    return () => {
      isMounted = false;
    };
  };

  return (
    <div className="min-h-screen bg-white py-6 lg:px-20 md:px-16 sm:px-12 px-4">
      <header className="bg-[#F2F2F2] rounded-xl mb-3">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <img src={logo} alt="CarFlex Logo" className="h-12" />
              <h2 className="text-lg font-semibold text-[#575757]">
                Invoice for Booking #{bookingId}
              </h2>
            </div>
            <button
              onClick={() => navigate("/vehicle-dashboard")}
              className="flex items-center space-x-2 text-[#492F92] hover:text-[#3b2371] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back to Dashboard</span>
            </button>
          </div>
        </div>
      </header>
      <div className="w-full mx-auto py-8">
        {isLoading ? (
          <div className="text-center py-6">
            <p className="text-gray-500 text-sm">Loading invoice...</p>
          </div>
        ) : !invoice || Object.keys(invoice).length === 0 ? (
          <div className="text-center py-6">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-sm">
              No invoice found for this booking.
            </p>
            <button
              onClick={() => navigate("/vehicle-dashboard")}
              className="mt-4 bg-[#492F92] text-white px-4 py-2 rounded-full text-sm hover:bg-[#3b2371] transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        ) : (
          <div className="bg-[#F4F4F4] rounded-xl border border-[#EBEBEB] p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-[#575757] mb-4">
              Invoice Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-gray-600">
                  Booking ID
                </span>
                <p className="font-semibold text-gray-900 text-sm">
                  {invoice.booking_id || bookingId}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">
                  Customer Name
                </span>
                <p className="font-semibold text-gray-900 text-sm">
                  {invoice.full_name || "N/A"}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">
                  Vehicle
                </span>
                <p className="font-semibold text-gray-900 text-sm">
                  {invoice.vehicle_type || "N/A"} {invoice.make || ""}{" "}
                  {invoice.model || ""}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">
                  Service Required
                </span>
                <p className="font-semibold text-gray-900 text-sm">
                  {invoice.service_required || "N/A"}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">
                  Service Center
                </span>
                <p className="font-semibold text-gray-900 text-sm">
                  {invoice.service_center || "N/A"}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">
                  Service Date
                </span>
                <p className="font-semibold text-gray-900 text-sm">
                  {invoice.service_date || "N/A"}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">
                  Total Amount
                </span>
                <p className="font-semibold text-gray-900 text-sm">
                  {formatNaira(invoice.total_amount || "0")}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">
                  Status
                </span>
                <p className="font-semibold text-gray-900 text-sm">
                  {invoice.status || "N/A"}
                </p>
              </div>
              {invoice?.additional_services?.length > 0 && (
                <div className="col-span-1 sm:col-span-2">
                  <span className="text-sm font-medium text-gray-600">
                    Additional Services
                  </span>
                  <ul className="list-disc pl-5 space-y-1">
                    {invoice.additional_services.map((service, index) => (
                      <li
                        key={index}
                        className="text-sm font-semibold text-gray-900 marker:text-[#492F92]"
                      >
                        {service}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className={`flex items-center space-x-2 bg-[#492F92] text-white px-4 py-2 rounded-full text-sm hover:bg-[#3b2371] transition-colors ${
                  isDownloading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <Download className="w-4 h-4" />
                <span>
                  {isDownloading ? "Downloading..." : "Download Invoice"}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Invoice;
