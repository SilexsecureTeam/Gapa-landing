import React, { useState } from "react";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    setSubmitted(true);
    setEmail("");

    // Here you'd usually make a POST request to your API
    // e.g., axios.post("/api/subscribe", { email })
  };

  return (
    <section className="pt-8 md:pt-12 lg:pt-16 lg:px-20 md:px-16 sm:px-12 px-8">
      <div className="bg-[#492F92] p-10">
        <h2 className="text-2xl md:text-3xl font-normal max-w-[450px] text-[#F7CD3A] mb-4">
          Subscribe to our newsetter for the Latest Updates
        </h2>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row   gap-4"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-3 rounded-md max-w-[370px] bg-[#EFECE0] focus:outline-none focus:ring-2 focus:ring-[#F7CD3A]"
          />
          <button
            type="submit"
            className="bg-[#F7CD3A] text-white px-6 py-3 rounded-md cursor-pointer transition-colors"
          >
            Subscribe
          </button>
        </form>

        {error && <p className="text-red-500 mt-4">{error}</p>}
        {submitted && (
          <p className="text-green-600 mt-4">Thanks for subscribing!</p>
        )}
      </div>
    </section>
  );
};

export default Newsletter;
