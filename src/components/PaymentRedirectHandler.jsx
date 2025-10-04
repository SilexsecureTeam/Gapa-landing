import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const PaymentRedirectHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const paymentStatus = urlParams.get("status");

    if (paymentStatus === "success") {
      toast.success("Payment successful! Redirecting to dashboard...", {
        position: "top-right",
        autoClose: 2000,
      });
      // Navigate immediately after small timeout so toast can show briefly
      setTimeout(() => {
        navigate("/vehicle-dashboard");
      }, 1000);
    } else if (paymentStatus === "cancelled") {
      toast.info("Payment cancelled. Redirecting to dashboard...", {
        position: "top-right",
        autoClose: 2000,
      });
      setTimeout(() => {
        navigate("/vehicle-dashboard");
      }, 1000);
    } else if (paymentStatus === "failed") {
      toast.error("Payment failed. Redirecting to dashboard...", {
        position: "top-right",
        autoClose: 2000,
      });
      setTimeout(() => {
        navigate("/vehicle-dashboard");
      }, 1000);
    } else {
      // If no status, just redirect immediately to avoid showing blank screen
      navigate("/vehicle-dashboard");
    }
  }, [location.search, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-700 text-lg">Redirecting, please wait...</p>
    </div>
  );
};

export default PaymentRedirectHandler;
