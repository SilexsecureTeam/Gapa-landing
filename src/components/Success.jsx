import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const Success = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { formData, trustData, appointmentDate, appointmentTime, bookingId } =
    location.state || {};

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen py-8 md:py-12 px-4 sm:px-8 md:px-16 lg:px-20 bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 sm:p-8 md:p-12">
        {/* Success Icon and Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#141414] mb-4">
            Booking Confirmed!
          </h1>
          <p className="text-lg text-[#333333] mb-2">
            Your appointment has been successfully scheduled.
          </p>
          <p className="text-base hidden text-[#666666]">
            Booking ID: {bookingId || "Not provided"}
          </p>
        </div>

        {/* Submitted Information */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-[#141414] mb-4">
            Booking Details:
          </h2>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row">
              <span className="font-semibold text-[#333333] w-full sm:w-40 mb-1 sm:mb-0">
                Full Name:
              </span>
              <span className="text-[#666666]">
                {formData?.fullName || "Not provided"}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row">
              <span className="font-semibold text-[#333333] w-full sm:w-40 mb-1 sm:mb-0">
                Vehicle Make:
              </span>
              <span className="text-[#666666]">
                {formData?.vehicleMake || "Not provided"}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row">
              <span className="font-semibold text-[#333333] w-full sm:w-40 mb-1 sm:mb-0">
                Vehicle Model:
              </span>
              <span className="text-[#666666]">
                {formData?.vehicleModel || "Not provided"}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row">
              <span className="font-semibold text-[#333333] w-full sm:w-40 mb-1 sm:mb-0">
                VIN:
              </span>
              <span className="text-[#666666] font-mono">
                {formData?.vin || "Not provided"}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row">
              <span className="font-semibold text-[#333333] w-full sm:w-40 mb-1 sm:mb-0">
                Vehicle Type:
              </span>
              <span className="text-[#666666]">
                {trustData?.vehicle || "Not provided"}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row">
              <span className="font-semibold text-[#333333] w-full sm:w-40 mb-1 sm:mb-0">
                Service:
              </span>
              <span className="text-[#666666]">
                {trustData?.service || "Not provided"}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row">
              <span className="font-semibold text-[#333333] w-full sm:w-40 mb-1 sm:mb-0">
                Location:
              </span>
              <span className="text-[#666666]">
                {trustData?.location || "Not provided"}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row">
              <span className="font-semibold text-[#333333] w-full sm:w-40 mb-1 sm:mb-0">
                Appointment Date:
              </span>
              <span className="text-[#666666]">
                {appointmentDate
                  ? `${appointmentDate.day}/${appointmentDate.month + 1}/${
                      appointmentDate.year
                    }`
                  : "Not provided"}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row">
              <span className="font-semibold text-[#333333] w-full sm:w-40 mb-1 sm:mb-0">
                Appointment Time:
              </span>
              <span className="text-[#666666]">
                {appointmentTime || "Not provided"}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="text-center">
          <button
            onClick={handleBackToHome}
            className="bg-[#492F92] text-white px-8 py-3 rounded-md hover:bg-[#3b2371] font-semibold transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Success;
