import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import React from "react";

const Suc = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return <p className="text-center mt-10">No submission data found.</p>;
  }

  return (
    <section className="min-h-screen px-4 py-16 bg-[#f4f4f8] flex justify-center items-center">
      <div className="max-w-lg bg-white p-6 md:p-10 rounded-lg shadow-lg text-center">
        <CheckCircle className="mx-auto text-green-500 w-16 h-16 mb-4" />
        <h1 className="text-2xl font-bold text-[#492F92] mb-4">
          Thank You for Contacting Us!
        </h1>
        <p className="text-gray-700 mb-6">
          We’ve received your message. Here’s what you submitted:
        </p>

        <ul className="text-left text-gray-600 mb-6 space-y-1">
          <li>
            <strong>First Name:</strong> {state.firstName}
          </li>
          <li>
            <strong>Last Name:</strong> {state.lastName}
          </li>
          <li>
            <strong>Email:</strong> {state.email}
          </li>
          <li>
            <strong>Phone:</strong> {state.phone}
          </li>
          <li>
            <strong>Message:</strong> {state.message}
          </li>
        </ul>

        <button
          onClick={() => navigate("/")}
          className="mt-4 bg-[#492F92] hover:bg-[#3f2780] text-white px-6 py-3 rounded-lg transition"
        >
          Go Back Home
        </button>
      </div>
    </section>
  );
};

export default Suc;
