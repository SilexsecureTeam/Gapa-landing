import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const Success = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get form data from navigation state
  const formData = location.state?.formData || {};

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
            Thank You for Submitting!
          </h1>
          <p className="text-lg text-[#333333] mb-2">
            Your information has been successfully received.
          </p>
          <p className="text-base text-[#666666]">
            We will get back to you soon with further details.
          </p>
        </div>

        {/* Submitted Information */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-[#141414] mb-4">
            Submitted Information:
          </h2>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row">
              <span className="font-semibold text-[#333333] w-full sm:w-40 mb-1 sm:mb-0">
                Full Name:
              </span>
              <span className="text-[#666666]">
                {formData.fullName || "Not provided"}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row">
              <span className="font-semibold text-[#333333] w-full sm:w-40 mb-1 sm:mb-0">
                Vehicle Make:
              </span>
              <span className="text-[#666666]">
                {formData.vehicleMake || "Not provided"}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row">
              <span className="font-semibold text-[#333333] w-full sm:w-40 mb-1 sm:mb-0">
                Vehicle Model:
              </span>
              <span className="text-[#666666]">
                {formData.vehicleModel || "Not provided"}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row">
              <span className="font-semibold text-[#333333] w-full sm:w-40 mb-1 sm:mb-0">
                VIN:
              </span>
              <span className="text-[#666666] font-mono">
                {formData.vin || "Not provided"}
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
