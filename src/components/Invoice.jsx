import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation, Link } from "react-router-dom";
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
  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const navigate = useNavigate();
  const { bookingId } = useParams();
  const location = useLocation();

  // Text-to-JSON parser for invoice response
  const parseTextToJson = (text) => {
    try {
      const lines = text.split("\n");
      const json = {
        logo: "",
        booking_id: "",
        full_name: "",
        email: "",
        service_fee: [],
        workmanship: 0,
        total_amount: 0,
        download_link: "",
        maintenance_start_date: "N/A", // Default for missing date
        maintenance_end_date: "N/A", // Default for missing date
        message: "No message provided",
        change_part: false,
      };
      let currentService = null;
      lines.forEach((line) => {
        line = line.trim();
        if (line.startsWith("Logo: ")) json.logo = line.replace("Logo: ", "");
        if (line.startsWith("Booking ID: "))
          json.booking_id = line.replace("Booking ID: ", "");
        if (line.startsWith("Customer: ")) {
          const [name, email] = line.replace("Customer: ", "").split(" (");
          json.full_name = name;
          json.email = email ? email.replace(")", "") : "";
        }
        if (line.match(/^- /)) {
          currentService = { name: line.replace("- ", "").trim() };
          json.service_fee.push(currentService);
        }
        if (line.match(/Price: ₦/)) {
          currentService.price = parseFloat(
            line.replace("Price: ₦", "").replace(/,/g, "")
          );
        }
        if (line.match(/Qty: /)) {
          currentService.quantity = parseInt(line.replace("Qty: ", ""));
        }
        if (line.match(/Subtotal: ₦/)) {
          currentService.subtotal = parseFloat(
            line.replace("Subtotal: ₦", "").replace(/,/g, "")
          );
        }
        if (line.match(/Workmanship: ₦/)) {
          json.workmanship = parseFloat(
            line.replace("Workmanship: ₦", "").replace(/,/g, "")
          );
        }
        if (line.match(/Total: ₦/)) {
          json.total_amount = parseFloat(
            line.replace("Total: ₦", "").replace(/,/g, "")
          );
        }
        if (line.startsWith("Download Invoice (PDF): ")) {
          json.download_link = line.replace("Download Invoice (PDF): ", "");
        }
      });
      return json;
    } catch (e) {
      console.error("Failed to parse text to JSON:", e);
      return null;
    }
  };

  useEffect(() => {
    const fetchInvoiceAndBooking = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("Please log in to view the invoice.", {
          position: "top-right",
          autoClose: 3000,
          action: { label: "Log In", onClick: () => navigate("/signin") },
        });
        setIsLoading(false);
        return;
      }

      let isMounted = true;
      setIsLoading(true);

      try {
        // Validate bookingId is numerical
        const numericalId = parseInt(bookingId);
        if (isNaN(numericalId)) {
          throw new Error(
            `Invalid booking ID: ${bookingId}. Must be numerical.`
          );
        }

        // Fetch invoice
        console.log("Fetching invoice for ID:", numericalId);
        const response = await axios.get(
          `https://api.gapafix.com.ng/api/booking/${numericalId}/invoice/view`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(
          "Invoice response:",
          JSON.stringify(response.data, null, 2)
        );

        if (isMounted) {
          let invoiceData = response.data.data || response.data || {};
          // Handle text response
          if (typeof response.data === "string") {
            console.warn(
              "Invoice response is a string, attempting to parse as JSON."
            );
            try {
              invoiceData = JSON.parse(response.data);
            } catch (parseError) {
              console.warn(
                "Failed to parse as JSON, using text parser:",
                response.data
              );
              invoiceData = parseTextToJson(response.data);
              if (!invoiceData) {
                throw new Error("Failed to parse invoice text response.");
              }
            }
          }

          console.log("Invoice data extracted:", invoiceData);

          const normalizedInvoice = {
            booking_id:
              invoiceData.booking_id || location.state?.booking_id || "N/A",
            full_name:
              invoiceData.full_name || location.state?.full_name || "N/A",
            email: invoiceData.email || location.state?.email || "N/A",
            message: invoiceData.message || "No message provided",
            change_part: invoiceData.change_part || false,
            service_fee: invoiceData.service_fee || [],
            workmanship: parseFloat(invoiceData.workmanship) || 0,
            total_amount: parseFloat(invoiceData.total_amount) || 0,
            maintenance_start_date: invoiceData.maintenance_start_date || "N/A",
            maintenance_end_date: invoiceData.maintenance_end_date || "N/A",
            download_link: invoiceData.download_link || "",
          };

          // Log normalized invoice for debugging
          console.log("Normalized invoice:", normalizedInvoice);

          // Set booking details from location.state or fetch /orders
          if (location.state) {
            setBooking({
              vehicle_type: location.state.vehicle_type || "N/A",
              make: location.state.vehicle_make || "",
              model: location.state.vehicle_model || "",
              service_required: location.state.service_required || "N/A",
              service_center: location.state.service_center || "N/A",
              service_date: location.state.service_date || "N/A",
              status: location.state.status || "N/A",
              additional_services: location.state.additional_services || [],
            });
          } else {
            const ordersResponse = await axios.get(
              "https://api.gapafix.com.ng/api/orders",
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            const fetchedBookings = ordersResponse.data.data || [];
            const selectedBooking = fetchedBookings.find(
              (b) => b.id === numericalId
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
          }

          // Check if invoice is valid (relaxed condition)
          if (
            !invoiceData ||
            (Object.keys(invoiceData).length === 0 &&
              !normalizedInvoice.booking_id &&
              normalizedInvoice.service_fee.length === 0 &&
              normalizedInvoice.workmanship === 0 &&
              normalizedInvoice.total_amount === 0)
          ) {
            console.log("Invoice considered invalid due to empty or zero data");
            toast.warn(
              `No invoice available for booking #${bookingId}. Contact support if this is an error.`,
              {
                position: "top-right",
                autoClose: 3000,
              }
            );
            setInvoice(null);
          } else {
            setInvoice(normalizedInvoice);
          }
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
              "Network error: Unable to connect to the server. Please check your connection or contact support.",
              {
                position: "top-right",
                autoClose: 3000,
              }
            );
          } else if (err.message.includes("Invalid booking ID")) {
            toast.error(
              `Invalid booking ID: ${bookingId}. Please check the ID and try again.`,
              {
                position: "top-right",
                autoClose: 3000,
              }
            );
          } else if (err.response?.status === 401) {
            localStorage.removeItem("authToken");
            localStorage.removeItem("user");
            toast.error("Session expired. Please log in again.", {
              position: "top-right",
              autoClose: 3000,
              action: { label: "Log In", onClick: () => navigate("/signin") },
            });
          } else if (err.response?.status === 404) {
            console.log("Invoice not found (404)");
            toast.warn(
              `No invoice available for booking #${bookingId}. Contact support if this is an error.`,
              {
                position: "top-right",
                autoClose: 3000,
              }
            );
            setInvoice(null);
          } else if (err.response?.status === 500) {
            console.log("Server error (500) for invoice fetch");
            toast.error(
              `Server error: Unable to retrieve invoice for booking #${bookingId}. Please contact support.`,
              {
                position: "top-right",
                autoClose: 3000,
              }
            );
            setInvoice(null);
          } else {
            toast.error(
              err.response?.data?.message ||
                "Failed to load invoice. Please try again.",
              {
                position: "top-right",
                autoClose: 3000,
              }
            );
            setInvoice(null);
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
  }, [bookingId, navigate, location.state]);

  const handleDownload = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Please log in to download the invoice.", {
        position: "top-right",
        autoClose: 3000,
        action: { label: "Log In", onClick: () => navigate("/signin") },
      });
      return;
    }

    let isMounted = true;
    setIsDownloading(true);

    try {
      const numericalId = parseInt(bookingId);
      if (isNaN(numericalId)) {
        throw new Error(`Invalid booking ID: ${bookingId}. Must be numerical.`);
      }

      console.log("Downloading invoice for ID:", numericalId);
      const response = await axios.get(
        `https://api.gapafix.com.ng/api/booking/${numericalId}/invoice/download`,
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
        link.setAttribute("download", `invoice_${numericalId}.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        toast.success("Invoice downloaded successfully!", {
          position: "top-right",
          autoClose: 2000,
        });
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
            "Network error: Unable to connect to the server. Please check your connection or contact support.",
            {
              position: "top-right",
              autoClose: 3000,
            }
          );
        } else if (err.message.includes("Invalid booking ID")) {
          toast.error(
            `Invalid booking ID: ${bookingId}. Please check the ID and try again.`,
            {
              position: "top-right",
              autoClose: 3000,
            }
          );
        } else if (err.response?.status === 401) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("user");
          toast.error("Session expired. Please log in again.", {
            position: "top-right",
            autoClose: 3000,
            action: { label: "Log In", onClick: () => navigate("/signin") },
          });
        } else if (err.response?.status === 404) {
          console.log("Invoice not found for download (404)");
          toast.warn(
            `No invoice available for booking #${bookingId}. Contact support if this is an error.`,
            {
              position: "top-right",
              autoClose: 3000,
            }
          );
        } else if (err.response?.status === 500) {
          console.log("Server error (500) for invoice download");
          toast.error(
            `Server error: Unable to download invoice for booking #${bookingId}. Please contact support.`,
            {
              position: "top-right",
              autoClose: 3000,
            }
          );
        } else {
          toast.error(
            err.response?.data?.message ||
              "Failed to download invoice. Please try again.",
            {
              position: "top-right",
              autoClose: 3000,
            }
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
        ) : !invoice ? (
          <div className="text-center py-6">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-sm">
              No invoice available for booking #{bookingId}. Contact support if
              this is an error.
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
              <div>
                <span className="text-sm font-medium text-gray-600">
                  Maintenance Start Date
                </span>
                <p className="font-semibold text-gray-900 text-sm">
                  {invoice.maintenance_start_date}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">
                  Maintenance End Date
                </span>
                <p className="font-semibold text-gray-900 text-sm">
                  {invoice.maintenance_end_date}
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
                  Workmanship
                </span>
                <p className="font-semibold text-gray-900 text-sm">
                  {formatNaira(invoice.workmanship)}
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
                        {service.quantity} = {formatNaira(service.subtotal)}
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
            {invoice.download_link && (
              <div className="mt-6 flex justify-end">
                <a
                  href={invoice.download_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center space-x-2 bg-[#492F92] text-white px-4 py-2 rounded-full text-sm hover:bg-[#3b2371] transition-colors ${
                    isDownloading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={(e) => {
                    if (isDownloading) e.preventDefault();
                    else handleDownload();
                  }}
                >
                  <Download className="w-4 h-4" />
                  <span>
                    {isDownloading ? "Downloading..." : "Download Invoice"}
                  </span>
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Invoice;
