import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
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

const Invoice = () => {
  const [invoice, setInvoice] = useState(null);
  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  console.log("location.state:", location.state);

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
          json.maintenance_end_date = line.replace(
            "Maintenance End Date: ",
            ""
          );
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
        const numericalId = parseInt(location.state?.id);
        if (!location.state || isNaN(numericalId)) {
          throw new Error("No valid booking ID provided.");
        }

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
          let invoiceData =
            response.data.quote || response.data.data || response.data || {};
          if (typeof response.data === "string") {
            console.warn(
              "Invoice response is a string, attempting to parse as JSON."
            );
            try {
              invoiceData = JSON.parse(response.data);
            } catch {
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
              location.state?.booking_id ||
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

          console.log("Normalized invoice:", normalizedInvoice);

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
            console.log("Invoice considered invalid due to empty or zero data");
            setInvoice(null);
          } else {
            setInvoice(normalizedInvoice);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }

      return () => {
        isMounted = false;
      };
    };

    if (location.state?.id) {
      fetchInvoiceAndBooking();
    } else {
      toast.error(
        "No booking selected. Please select a booking from the dashboard.",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
      setIsLoading(false);
    }
  }, [navigate, location.state]);

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

    const numericalId = parseInt(location.state?.id);
    const bookingId =
      invoice.booking_id || location.state?.booking_id || "invoice";
    if (!bookingId || bookingId === "N/A") {
      toast.error("No valid booking ID provided for download.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    console.log("Invoice data for PDF:", JSON.stringify(invoice, null, 2));
    console.log("Booking data for PDF:", JSON.stringify(booking, null, 2));

    setIsDownloading(true);
    try {
      console.log("Initiating download for booking ID:", bookingId);
      let response;
      try {
        response = await axios.get(
          `https://api.gapafix.com.ng/api/booking/${bookingId}/invoice/download`,
          {
            headers: { Authorization: `Bearer ${token}` },
            responseType: "blob",
          }
        );
        console.log("Download response headers:", response.headers);

        if (response.headers["content-type"] !== "application/pdf") {
          const text = await response.data.text();
          console.error("Non-PDF response received:", text);
          throw new Error("Server did not return a valid PDF file.");
        }

        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `invoice_${bookingId}.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        toast.success(`Invoice #${bookingId} downloaded successfully!`, {
          position: "top-right",
          autoClose: 2000,
        });
        return;
      } catch (err) {
        console.error("Server download error:", {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
        });

        if (err.response?.status === 404 && numericalId) {
          console.log(
            "Trying fallback endpoint with numerical ID:",
            numericalId
          );
          response = await axios.get(
            `https://api.gapafix.com.ng/api/booking/${numericalId}/invoice/download`,
            {
              headers: { Authorization: `Bearer ${token}` },
              responseType: "blob",
            }
          );
          console.log("Fallback response headers:", response.headers);

          if (response.headers["content-type"] !== "application/pdf") {
            const text = await response.data.text();
            console.error("Non-PDF response received from fallback:", text);
            throw new Error("Fallback server did not return a valid PDF file.");
          }

          const blob = new Blob([response.data], { type: "application/pdf" });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", `invoice_${bookingId}.pdf`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);

          toast.success(`Invoice #${bookingId} downloaded successfully!`, {
            position: "top-right",
            autoClose: 2000,
          });
          return;
        }
        console.log(
          "Server-side PDF failed, falling back to client-side generation"
        );
      }

      console.log("Generating client-side PDF for booking ID:", bookingId);
      try {
        const doc = new jsPDF();

        if (invoice.logo) {
          try {
            doc.addImage(invoice.logo, "PNG", 20, 10, 50, 20);
          } catch (e) {
            console.warn("Failed to add logo to PDF:", e);
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

        doc.save(`invoice_${bookingId}.pdf`);
        toast.success(
          `Invoice #${bookingId} generated and downloaded locally!`,
          {
            position: "top-right",
            autoClose: 2000,
          }
        );
      } catch (pdfErr) {
        console.error("Error generating client-side PDF:", pdfErr);
        toast.error(
          "Failed to generate invoice PDF locally. Please contact support.",
          {
            position: "top-right",
            autoClose: 3000,
          }
        );
      }
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
                Invoice for Booking #
                {invoice?.booking_id || location.state?.booking_id || "N/A"}
              </h2>
            </div>
            <button
              onClick={() => navigate(-1)}
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
              No invoice is available for booking #
              {location.state?.booking_id || "unknown"}. Please wait until the
              admin generates a quote or contact support for assistance.
            </p>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 bg-[#492F92] text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-[#3b2371] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>
          </div>
        ) : (
          <div className="bg-[#F4F4F4] rounded-xl border border-[#EBEBEB] p-4 sm:p-6">
            {invoice.logo && (
              <div className="mb-6">
                <img
                  src={invoice.logo}
                  alt="Gapafix Logo"
                  className="h-12 mx-auto"
                />
              </div>
            )}
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
                  {invoice.email && `(${invoice.email})`}
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
                  Status
                </span>
                <p className="font-semibold text-gray-900 text-sm">
                  {invoice.status || "N/A"}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">
                  Created At
                </span>
                <p className="font-semibold text-gray-900 text-sm">
                  {invoice.created_at || "N/A"}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">
                  Updated At
                </span>
                <p className="font-semibold text-gray-900 text-sm">
                  {invoice.updated_at || "N/A"}
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
                      {booking.service_required || "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Service Center
                    </span>
                    <p className="font-semibold text-gray-900 text-sm">
                      {booking.service_center || "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Service Date
                    </span>
                    <p className="font-semibold text-gray-900 text-sm">
                      {booking.service_date || "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Status
                    </span>
                    <p className="font-semibold text-gray-900 text-sm">
                      {booking.status || "N/A"}
                    </p>
                  </div>
                </>
              )}
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
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleDownload}
                className={`flex items-center space-x-2 bg-[#492F92] text-white px-4 py-2 rounded-full text-sm hover:bg-[#3b2371] transition-colors ${
                  isDownloading || !invoice
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                disabled={isDownloading || !invoice}
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
