import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FileText, Download, ArrowLeft } from "lucide-react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
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

function parseTextToJson(text) {
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
      maintenance_start_date: "N/A",
      maintenance_end_date: "N/A",
      message: "No message provided",
      change_part: false,
      status: "N/A",
      created_at: "N/A",
      updated_at: "N/A",
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
      if (line.startsWith("Message: "))
        json.message = line.replace("Message: ", "");
      if (line.startsWith("Maintenance Start Date: "))
        json.maintenance_start_date = line.replace(
          "Maintenance Start Date: ",
          ""
        );
      if (line.startsWith("Maintenance End Date: "))
        json.maintenance_end_date = line.replace("Maintenance End Date: ", "");
      if (line.startsWith("Change Part: "))
        json.change_part = line.replace("Change Part: ", "") === "Yes";
      if (line.startsWith("Status: "))
        json.status = line.replace("Status: ", "");
      if (line.startsWith("Created At: "))
        json.created_at = line.replace("Created At: ", "");
      if (line.startsWith("Updated At: "))
        json.updated_at = line.replace("Updated At: ", "");
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
    });
    return json;
  } catch {
    console.error("Failed to parse text to JSON");
    return null;
  }
}

const Invoice = () => {
  const [invoice, setInvoice] = useState(null);
  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { bookingId } = useParams();

  const handlePayNow = async () => {
    if (!invoice) return;
    if (invoice.total_amount <= 0) {
      toast.error("Invoice amount must be greater than zero.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    if (!invoice.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(invoice.email)) {
      toast.error("Please provide a valid email address for payment.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    const token = localStorage.getItem("authToken");

    try {
      setIsProcessingPayment(true);
      const payload = {
        email: invoice.email,
        amount: invoice.total_amount * 100,
        booking_id: invoice.booking_id,
      };

      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      if (token) headers.Authorization = `Bearer ${token}`;

      const response = await axios.post(
        `https://api.gapafix.com.ng/api/bookings/${invoice.booking_id}/initialize-payment`,
        payload,
        { headers }
      );

      if (response.data.status && response.data.data?.authorization_url) {
        window.location.href = response.data.data.authorization_url;
        toast.info("Redirecting to payment page...", {
          position: "top-right",
          autoClose: 2000,
        });
      } else {
        throw new Error(
          "Payment initialization failed: No authorization URL returned."
        );
      }
    } catch (error) {
      console.error("Payment initialization failed:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to initialize payment. Please try again.",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
    } finally {
      setIsProcessingPayment(false);
    }
  };

  useEffect(() => {
    const fetchInvoiceAndBooking = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        navigate(`/signin?redirect=/booking/${bookingId}/invoice`);
        toast.error("Please log in to view the invoice.", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      let isMounted = true;
      setIsLoading(true);

      try {
        const numericalId = parseInt(bookingId);
        if (isNaN(numericalId)) {
          throw new Error("Invalid booking ID in URL.");
        }

        const response = await axios.get(
          `https://api.gapafix.com.ng/api/booking/${numericalId}/invoice/view`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        let invoiceData =
          response.data.quote || response.data.data || response.data || {};
        if (typeof response.data === "string") {
          try {
            invoiceData = JSON.parse(response.data);
          } catch {
            invoiceData = parseTextToJson(response.data);
            if (!invoiceData) {
              throw new Error("Failed to parse invoice text response.");
            }
          }
        }

        const serviceFeeArray = invoiceData.service_fee
          ? Object.values(invoiceData.service_fee).map((fee) => ({
              name: fee.name,
              price: parseFloat(fee.price) || 0,
              quantity: parseInt(fee.quantity) || 1,
              subtotal: parseFloat(fee.price) * (parseInt(fee.quantity) || 1),
            }))
          : [];

        const normalizedInvoice = {
          booking_id:
            invoiceData.user_booking_id ||
            invoiceData.booking_id ||
            bookingId ||
            "N/A",
          full_name:
            invoiceData.full_name || location.state?.full_name || "N/A",
          email: invoiceData.email || location.state?.email || "N/A",
          message: invoiceData.message || "No message provided",
          change_part: Boolean(invoiceData.change_part) || false,
          service_fee: serviceFeeArray,
          workmanship: parseFloat(invoiceData.workmanship) || 0,
          total_amount: parseFloat(invoiceData.total_amount) || 0,
          maintenance_start_date: invoiceData.maintenance_start_date || "N/A",
          maintenance_end_date: invoiceData.maintenance_end_date || "N/A",
          logo: invoiceData.logo || "",
          status: invoiceData.status || "N/A",
          created_at: invoiceData.created_at || "N/A",
          updated_at: invoiceData.updated_at || "N/A",
        };

        if (location.state) {
          setBooking({
            vehicle_type: location.state.vehicle_type || "N/A",
            make: location.state.make || location.state.vehicle_make || "N/A",
            model:
              location.state.model || location.state.vehicle_model || "N/A",
            service_required: location.state.service_required || "N/A",
            service_center: location.state.service_center || "N/A",
            service_date: location.state.service_date || "N/A",
            status: location.state.status || "N/A",
            additional_services: location.state.additional_services || [],
          });
        }

        if (
          !invoiceData ||
          (Object.keys(invoiceData).length === 0 &&
            !normalizedInvoice.booking_id &&
            normalizedInvoice.service_fee.length === 0 &&
            normalizedInvoice.workmanship === 0 &&
            normalizedInvoice.total_amount === 0)
        ) {
          setInvoice(null);
        } else {
          setInvoice(normalizedInvoice);
        }

        const urlParams = new URLSearchParams(location.search);
        if (urlParams.get("status") === "success") {
          // Store payment timestamp and maintenance_end_date in localStorage
          const paymentTimestamps = JSON.parse(
            localStorage.getItem("paymentTimestamps") || "{}"
          );
          const maintenanceEndDates = JSON.parse(
            localStorage.getItem("maintenanceEndDates") || "{}"
          );
          paymentTimestamps[normalizedInvoice.booking_id] =
            new Date().toISOString();
          if (normalizedInvoice.maintenance_end_date !== "N/A") {
            maintenanceEndDates[normalizedInvoice.booking_id] =
              normalizedInvoice.maintenance_end_date;
          }
          localStorage.setItem(
            "paymentTimestamps",
            JSON.stringify(paymentTimestamps)
          );
          localStorage.setItem(
            "maintenanceEndDates",
            JSON.stringify(maintenanceEndDates)
          );

          toast.success("Payment successful! Redirecting to dashboard...", {
            position: "top-right",
            autoClose: 3000,
            onClose: () => navigate("/vehicle-dashboard"),
          });
        } else if (urlParams.get("status") === "cancelled") {
          toast.info("Payment cancelled. You can try again.", {
            position: "top-right",
            autoClose: 3000,
            onClose: () => navigate("/vehicle-dashboard"),
          });
        } else if (urlParams.get("status") === "failed") {
          toast.error("Payment failed. Please try again.", {
            position: "top-right",
            autoClose: 3000,
            onClose: () => navigate("/vehicle-dashboard"),
          });
        }
      } catch (err) {
        toast.error(
          `Failed to load invoice: ${err.message || "Unknown error"}`,
          {
            position: "top-right",
            autoClose: 3000,
          }
        );
      } finally {
        if (isMounted) setIsLoading(false);
      }

      return () => {
        isMounted = false;
      };
    };

    if (bookingId) {
      fetchInvoiceAndBooking();
    } else {
      toast.error(
        "Invalid booking ID. Please access the invoice from a valid link or the dashboard.",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
      setIsLoading(false);
    }
  }, [navigate, location.state, location.search, bookingId]);

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

    if (!invoice) {
      toast.warn("No invoice available to download.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const bookingIdForDownload = invoice.booking_id || bookingId || "invoice";
    if (!bookingIdForDownload || bookingIdForDownload === "N/A") {
      toast.error("No valid booking ID provided for download.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setIsDownloading(true);
    try {
      let response;
      try {
        response = await axios.get(
          `https://api.gapafix.com.ng/api/booking/${bookingIdForDownload}/invoice/download`,
          {
            headers: { Authorization: `Bearer ${token}` },
            responseType: "blob",
          }
        );

        if (response.headers["content-type"] !== "application/pdf") {
          throw new Error("Server did not return a valid PDF file.");
        }

        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `invoice_${bookingIdForDownload}.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        toast.success(
          `Invoice #${bookingIdForDownload} downloaded successfully!`,
          {
            position: "top-right",
            autoClose: 2000,
          }
        );
        return;
      } catch (err) {
        if (err.response?.status === 404) {
          response = await axios.get(
            `https://api.gapafix.com.ng/api/booking/${parseInt(
              bookingId
            )}/invoice/download`,
            {
              headers: { Authorization: `Bearer ${token}` },
              responseType: "blob",
            }
          );

          if (response.headers["content-type"] !== "application/pdf") {
            throw new Error("Fallback server did not return a valid PDF file.");
          }

          const blob = new Blob([response.data], { type: "application/pdf" });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", `invoice_${bookingIdForDownload}.pdf`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);

          toast.success(
            `Invoice #${bookingIdForDownload} downloaded successfully!`,
            {
              position: "top-right",
              autoClose: 2000,
            }
          );
          return;
        }
        throw err;
      }
    } catch {
      const doc = new jsPDF();

      if (invoice.logo) {
        try {
          doc.addImage(invoice.logo, "PNG", 20, 10, 50, 20);
        } catch {
          doc.addImage(logo, "PNG", 20, 10, 50, 20);
        }
      }
      doc.setFontSize(16);
      doc.text(`Invoice #${invoice.booking_id}`, 20, 35);

      doc.autoTable({
        startY: 45,
        head: [["Field", "Value"]],
        body: [
          ["Customer Name", invoice.full_name || "N/A"],
          ["Email", invoice.email || "N/A"],
          ["Message", invoice.message || "N/A"],
          ["Change Parts", invoice.change_part ? "Yes" : "No"],
          ["Maintenance Start Date", invoice.maintenance_start_date || "N/A"],
          ["Maintenance End Date", invoice.maintenance_end_date || "N/A"],
          ["Status", invoice.status || "N/A"],
          ["Created At", invoice.created_at || "N/A"],
          ["Updated At", invoice.updated_at || "N/A"],
        ],
        theme: "striped",
        styles: { fontSize: 10 },
        headStyles: { fillColor: [73, 47, 146] },
      });

      let y = doc.lastAutoTable.finalY + 10;
      if (invoice.service_fee?.length > 0) {
        doc.autoTable({
          startY: y,
          head: [["Service", "Price", "Quantity", "Subtotal"]],
          body: invoice.service_fee.map((service) => [
            service.name || "N/A",
            formatNaira(service.price),
            service.quantity || "N/A",
            formatNaira(service.subtotal),
          ]),
          theme: "striped",
          styles: { fontSize: 10 },
          headStyles: { fillColor: [73, 47, 146] },
        });
        y = doc.lastAutoTable.finalY + 10;
      }

      doc.autoTable({
        startY: y,
        head: [["Description", "Amount"]],
        body: [
          ["Workmanship", formatNaira(invoice.workmanship)],
          ["Total Amount", formatNaira(invoice.total_amount)],
        ],
        theme: "striped",
        styles: { fontSize: 10 },
        headStyles: { fillColor: [73, 47, 146] },
      });
      y = doc.lastAutoTable.finalY + 10;

      if (booking) {
        doc.autoTable({
          startY: y,
          head: [["Field", "Value"]],
          body: [
            [
              "Vehicle",
              `${booking.vehicle_type} ${booking.make} ${booking.model}`.trim() ||
                "N/A",
            ],
            ["Service Required", booking.service_required || "N/A"],
            ["Service Center", booking.service_center || "N/A"],
            ["Service Date", booking.service_date || "N/A"],
            ["Status", booking.status || "N/A"],
            [
              "Additional Services",
              booking.additional_services?.join(", ") || "None",
            ],
          ],
          theme: "striped",
          styles: { fontSize: 10 },
          headStyles: { fillColor: [73, 47, 146] },
        });
      }

      doc.setFontSize(8);
      doc.text("Generated by CarFlex", 20, doc.internal.pageSize.height - 10);

      doc.save(`invoice_${bookingIdForDownload}.pdf`);
      toast.success(
        `Invoice #${bookingIdForDownload} generated and downloaded locally!`,
        {
          position: "top-right",
          autoClose: 2000,
        }
      );
    } finally {
      setIsDownloading(false);
    }
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
                Invoice for Booking #{" "}
                {invoice?.booking_id || bookingId || "N/A"}
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
          <div className="flex flex-col items-center justify-center py-12 bg-[#F4F4F4] rounded-xl border border-[#EBEBEB]">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#492F92] mb-4"></div>
            <p className="text-gray-500 text-sm font-medium">
              Loading invoice...
            </p>
          </div>
        ) : !invoice ? (
          <div className="flex flex-col items-center justify-center py-12 bg-[#F4F4F4] rounded-xl border border-[#EBEBEB]">
            <FileText className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-[#575757] mb-2">
              No Invoice Available
            </h3>
            <p className="text-gray-500 text-sm text-center mb-6 max-w-md">
              No invoice is available for booking #{bookingId || "unknown"}.
              Please wait until the admin generates a quote or contact support
              for assistance.
            </p>
            <button
              onClick={() => navigate("/vehicle-dashboard")}
              className="flex items-center space-x-2 bg-[#492F92] text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-[#3b2371] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-[#EBEBEB] p-6 max-w-2xl mx-auto">
            {invoice.logo && (
              <div className="mb-6 text-center">
                <img
                  src={invoice.logo}
                  alt="Gapafix Logo"
                  className="h-12 mx-auto"
                />
              </div>
            )}
            <h1 className="text-xl font-bold text-[#575757] mb-2">
              Quote Created
            </h1>
            <p className="text-[#575757] mb-6">Hello {invoice.full_name},</p>
            <p className="text-[#575757] mb-4">
              A new quote has been created for your booking:
            </p>
            <div className="bg-[#F4F4F4] p-4 rounded-lg mb-4">
              <p className="font-semibold text-[#575757]">
                Booking ID: {invoice.booking_id}
              </p>
              {invoice.message && (
                <p className="text-[#575757] mt-2">
                  <strong>Message:</strong> {invoice.message}
                </p>
              )}
            </div>
            <div className="mb-6">
              <h3 className="font-semibold text-[#575757] mb-2">
                Maintenance Window:
              </h3>
              <p className="text-[#575757]">
                Start: {invoice.maintenance_start_date || "N/A"} | End:{" "}
                {invoice.maintenance_end_date || "N/A"}
              </p>
            </div>
            {invoice.service_fee?.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-[#575757] mb-3">
                  Parts & Services
                </h3>
                <table className="w-full border-collapse border border-[#EBEBEB]">
                  <thead>
                    <tr className="bg-[#F4F4F4]">
                      <th className="border border-[#EBEBEB] p-2 text-left">
                        Item
                      </th>
                      <th className="border border-[#EBEBEB] p-2 text-left">
                        Price
                      </th>
                      <th className="border border-[#EBEBEB] p-2 text-left">
                        Qty
                      </th>
                      <th className="border border-[#EBEBEB] p-2 text-left">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.service_fee.map((item, index) => (
                      <tr key={index}>
                        <td className="border border-[#EBEBEB] p-2">
                          {item.name}
                        </td>
                        <td className="border border-[#EBEBEB] p-2">
                          {formatNaira(item.price)}
                        </td>
                        <td className="border border-[#EBEBEB] p-2">
                          {item.quantity}
                        </td>
                        <td className="border border-[#EBEBEB] p-2">
                          {formatNaira(item.subtotal)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="bg-[#F4F4F4] p-4 rounded-lg mb-6">
              <p className="text-[#575757] mb-1">
                Subtotal:{" "}
                {formatNaira(invoice.total_amount - invoice.workmanship)}
              </p>
              <p className="text-[#575757] mb-1">
                Workmanship: {formatNaira(invoice.workmanship)}
              </p>
              <p className="text-xl font-bold text-[#492F92]">
                Total: {formatNaira(invoice.total_amount)}
              </p>
            </div>
            {booking && (
              <div className="bg-[#F4F4F4] p-4 rounded-lg mb-6">
                <h3 className="font-semibold text-[#575757] mb-2">
                  Booking Details
                </h3>
                <p>
                  <strong>Vehicle:</strong> {booking.vehicle_type}{" "}
                  {booking.make} {booking.model}
                </p>
                <p>
                  <strong>Service Required:</strong> {booking.service_required}
                </p>
                <p>
                  <strong>Service Center:</strong> {booking.service_center}
                </p>
                <p>
                  <strong>Service Date:</strong> {booking.service_date}
                </p>
                {booking.additional_services?.length > 0 && (
                  <p>
                    <strong>Additional Services:</strong>{" "}
                    {booking.additional_services.join(", ")}
                  </p>
                )}
              </div>
            )}
            {invoice?.status && (
              <div className="mt-4 text-center">
                <p className="text-sm font-medium text-[#575757]">
                  Payment Status:{" "}
                  <span className="capitalize">{invoice.status}</span>
                </p>
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-end items-end">
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-2 text-center">
                  Pay with Card, Bank Transfer, or USSD
                </p>
                <button
                  onClick={handlePayNow}
                  disabled={
                    isProcessingPayment || !invoice || invoice.total_amount <= 0
                  }
                  className={`w-full flex items-center justify-center space-x-2 bg-[#492F92] text-white py-3 rounded-full text-sm font-medium hover:bg-[#3b2371] transition-colors ${
                    isProcessingPayment || !invoice || invoice.total_amount <= 0
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {isProcessingPayment ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                      <span>Processing Payment...</span>
                    </>
                  ) : (
                    <span>Pay Now ({formatNaira(invoice.total_amount)})</span>
                  )}
                </button>
              </div>
              <button
                onClick={handleDownload}
                className="flex items-end h-fit space-x-2 bg-[#575757] text-white px-6 py-3 rounded-full text-sm hover:bg-gray-900 transition-colors"
                disabled={isDownloading || !invoice}
              >
                <Download className="w-4 h-4" />
                <span>
                  {isDownloading ? "Downloading..." : "Download Invoice"}
                </span>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-4 text-center">
              This is an automated notification from Gapafix.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Invoice;
