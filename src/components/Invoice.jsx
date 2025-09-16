import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
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

// Parse text response to extract invoice details
const parseTextInvoice = (text) => {
  const invoiceData = {
    booking_id: "N/A",
    full_name: "N/A",
    email: "N/A",
    message: "N/A",
    change_part: false,
    parts: [],
    service_fee: [],
    workmanship: 0,
    total_amount: 0,
  };

  const lines = text.split("\n");
  lines.forEach((line) => {
    if (line.startsWith("Booking ID: ")) {
      invoiceData.booking_id = line.replace("Booking ID: ", "").trim();
    } else if (line.startsWith("Customer: ")) {
      const customerMatch = line.match(/Customer: (.+) \((.+)\)/);
      if (customerMatch) {
        invoiceData.full_name = customerMatch[1].trim();
        invoiceData.email = customerMatch[2].trim();
      }
    } else if (line.startsWith("Total: ₦")) {
      const total = line.replace("Total: ₦", "").replace(/,/g, "").trim();
      invoiceData.total_amount = parseFloat(total) || 0;
    } else if (line.startsWith("Workmanship: ₦")) {
      const workmanship = line
        .replace("Workmanship: ₦", "")
        .replace(/,/g, "")
        .trim();
      invoiceData.workmanship = parseFloat(workmanship) || 0;
    } else if (line.startsWith("- ")) {
      const serviceMatch = line.match(
        /- (.+?)\s+Price: ₦([\d,.]+)\s+Qty: (\d+)/
      );
      if (serviceMatch) {
        invoiceData.service_fee.push({
          name: serviceMatch[1].trim(),
          price: parseFloat(serviceMatch[2].replace(/,/g, "")) || 0,
          quantity: parseInt(serviceMatch[3]) || 1,
        });
      }
    }
  });

  return invoiceData;
};

const Invoice = () => {
  const [invoice, setInvoice] = useState(null);
  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const navigate = useNavigate();
  const { bookingId } = useParams();

  useEffect(() => {
    const fetchInvoiceAndBooking = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("Please log in to view the invoice.", {
          action: { label: "Log In", onClick: () => navigate("/signin") },
        });
        setIsLoading(false);
        return;
      }

      let isMounted = true;
      setIsLoading(true);

      try {
        // Fetch booking details from /orders
        const ordersResponse = await axios.get(
          "https://api.gapafix.com.ng/api/orders",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const fetchedBookings = ordersResponse.data.data || [];
        const selectedBooking = fetchedBookings.find(
          (b) => b.booking_id === bookingId
        );
        if (selectedBooking) {
          setBooking({
            vehicle_type: selectedBooking.vehicle_type || "N/A",
            make: selectedBooking.vehicle_make || "",
            model: selectedBooking.vehicle_model || "",
            service_required: selectedBooking.service_required || "N/A",
            service_center: selectedBooking.service_center || "N/A",
            service_date: selectedBooking.service_date || "N/A",
            status: selectedBooking.status || "N/A",
            additional_services: selectedBooking.additional_services || [],
          });
        }

        // Fetch invoice
        console.log("Fetching invoice for bookingId:", bookingId);
        const response = await axios.get(
          `https://api.gapafix.com.ng/api/booking/${bookingId}/invoice/view`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(
          "Invoice response:",
          JSON.stringify(response.data, null, 2)
        );

        if (isMounted) {
          let invoiceData;
          if (typeof response.data === "string") {
            // Handle text response
            invoiceData = parseTextInvoice(response.data);
          } else {
            // Handle expected JSON response
            invoiceData = response.data.data || response.data || {};
            invoiceData = {
              booking_id: invoiceData.booking_id || bookingId,
              full_name: invoiceData.full_name || "N/A",
              email: invoiceData.email || "N/A",
              message: invoiceData.message || "N/A",
              change_part: invoiceData.change_part || false,
              parts: invoiceData.parts || [],
              service_fee: invoiceData.service_fee || [],
              workmanship: invoiceData.workmanship || 0,
              total_amount: invoiceData.total_amount || 0,
            };
          }

          if (
            Object.keys(invoiceData).length === 0 ||
            invoiceData.total_amount === 0
          ) {
            toast.warn(
              "No invoice data available. A quote may not have been fully generated for this booking."
            );
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
              "Network error: Unable to connect to the server. Please check your connection or contact the backend team."
            );
          } else if (err.response?.status === 401) {
            localStorage.removeItem("authToken");
            localStorage.removeItem("user");
            toast.error("Session expired. Please log in again.", {
              action: { label: "Log In", onClick: () => navigate("/signin") },
            });
          } else if (err.response?.status === 404) {
            toast.error(
              `Invoice for booking ID ${bookingId} not found. Please ensure a quote has been generated by an admin.`
            );
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
      fetchInvoiceAndBooking();
    }
  }, [bookingId, navigate]);

  const handleDownload = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Please log in to download the invoice.", {
        action: { label: "Log In", onClick: () => navigate("/signin") },
      });
      return;
    }

    let isMounted = true;
    setIsDownloading(true);

    try {
      console.log("Downloading invoice for bookingId:", bookingId);
      const response = await axios.get(
        `https://api.gapafix.com.ng/api/booking/${bookingId}/invoice/download`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );
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
            "Network error: Unable to connect to the server. Please check your connection or contact the backend team."
          );
        } else if (err.response?.status === 401) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("user");
          toast.error("Session expired. Please log in again.", {
            action: { label: "Log In", onClick: () => navigate("/signin") },
          });
        } else if (err.response?.status === 404) {
          toast.error(
            `Invoice PDF for booking ID ${bookingId} not found. Please ensure a quote has been generated.`
          );
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
              <Link to="/">
                <img src={logo} alt="CarFlex Logo" className="h-12" />
              </Link>
              <h2 className="text-lg font-semibold text-[#575757]">
                Invoice for Booking {bookingId}
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
              No invoice found for booking #{bookingId}. Please contact an admin
              to generate a quote.
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
                  {invoice.booking_id}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">
                  Customer Name
                </span>
                <p className="font-semibold text-gray-900 text-sm">
                  {invoice.full_name}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Email</span>
                <p className="font-semibold text-gray-900 text-sm">
                  {invoice.email}
                </p>
              </div>
              {booking && (
                <>
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Vehicle
                    </span>
                    <p className="font-semibold text-gray-900 text-sm">
                      {booking.vehicle_type} {booking.make} {booking.model}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Service Required
                    </span>
                    <p className="font-semibold text-gray-900 text-sm">
                      {booking.service_required}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Service Center
                    </span>
                    <p className="font-semibold text-gray-900 text-sm">
                      {booking.service_center}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Service Date
                    </span>
                    <p className="font-semibold text-gray-900 text-sm">
                      {booking.service_date}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Status
                    </span>
                    <p className="font-semibold text-gray-900 text-sm">
                      {booking.status}
                    </p>
                  </div>
                </>
              )}
              <div>
                <span className="text-sm font-medium text-gray-600">
                  Message
                </span>
                <p className="font-semibold text-gray-900 text-sm">
                  {invoice.message}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">
                  Change Parts
                </span>
                <p className="font-semibold text-gray-900 text-sm">
                  {invoice.change_part ? "Yes" : "No"}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">
                  Total Amount
                </span>
                <p className="font-semibold text-gray-900 text-sm">
                  {formatNaira(invoice.total_amount)}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">
                  Workmanship
                </span>
                <p className="font-semibold text-gray-900 text-sm">
                  {formatNaira(invoice.workmanship)}
                </p>
              </div>
              {invoice.parts?.length > 0 && (
                <div className="col-span-1 sm:col-span-2">
                  <span className="text-sm font-medium text-gray-600">
                    Parts
                  </span>
                  <ul className="list-disc pl-5 space-y-1">
                    {invoice.parts.map((part, index) => (
                      <li
                        key={index}
                        className="text-sm font-semibold text-gray-900 marker:text-[#492F92]"
                      >
                        {part.name} - {formatNaira(part.unit_price)} x{" "}
                        {part.quantity}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {invoice.service_fee?.length > 0 && (
                <div className="col-span-1 sm:col-span-2">
                  <span className="text-sm font-medium text-gray-600">
                    Services
                  </span>
                  <ul className="list-disc pl-5 space-y-1">
                    {invoice.service_fee.map((service, index) => (
                      <li
                        key={index}
                        className="text-sm font-semibold text-gray-900 marker:text-[#492F92]"
                      >
                        {service.name} - {formatNaira(service.price)} x{" "}
                        {service.quantity}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {booking?.additional_services?.length > 0 && (
                <div className="col-span-1 sm:col-span-2">
                  <span className="text-sm font-medium text-gray-600">
                    Additional Services
                  </span>
                  <ul className="list-disc pl-5 space-y-1">
                    {booking.additional_services.map((service, index) => (
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
