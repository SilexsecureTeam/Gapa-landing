import React from "react";
// import { Link } from "react-router-dom";

const TrustedSource = ({ onScheduleClick }) => {
  const features = [
    {
      title: "Genuine Spare Parts Guaranteed",
      text: "We source authentic auto spare parts for every repair, ensuring quality and reliability.",
      icon: "🔧",
    },
    {
      title: "Advanced Part-Matching Tech",
      text: "Our proprietary system finds the right spare part for your car with precision accuracy.",
      icon: "⚙️",
    },
    {
      title: "Customer Care - First",
      text: "Fast, transparent, and tailored to your needs with professional service excellence.",
      icon: "🚗",
    },
  ];

  return (
    <div className="bg-[#f3f1f7] pt-8 md:pt-12 lg:pt-16 lg:px-20 md:px-16 sm:px-12 px-4">
      {/* Main Content Section */}
      <div className=" mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-semibold text-2xl text-[#333333] md:text-[40px] leading-tight mb-6">
            GAPA Fix: Your Trusted Source for <br />
            Genuine Car Repairs
          </h1>
          <p className="md:text-lg text-base text-[#333333] max-w-5xl mx-auto leading-relaxed">
            At GAPA Fix, we eliminate the stress of car repairs with expert
            services and genuine auto spare parts powered by GAPA Naija. Our
            cutting-edge technology ensures the perfect spare part fit for your
            vehicle, eliminating the risk of fake or incorrect components. From
            oil changes to engine repairs, our certified technicians in Lagos
            deliver reliable, high-quality solutions to keep you driving with
            confidence.
          </p>
        </div>

        {/* Why Choose GAPA Fix Section */}
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#333333] text-center mb-8">
            Why Choose GAPA Fix?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg hover:shadow-lg transition-shadow duration-300"
              >
                <div className="text-4xl mb-4 text-center">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-[#333333] mb-3 text-center">
                  {feature.title}
                </h3>
                <p className="text-[#333333] text-base leading-relaxed text-center">
                  {feature.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="bg-[#492F92] p-8 md:p-12 rounded-lg text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
            Drive with Peace of Mind
          </h2>
          <p className="text-lg text-white mb-6 max-w-2xl mx-auto">
            Book your service today and experience GAPA Fix's commitment to
            excellence. Our expert team is ready to provide you with genuine
            parts and professional service.
          </p>
          <button
            onClick={onScheduleClick}
            className="bg-white text-[#492F92] font-semibold text-lg px-8 py-3 rounded hover:bg-gray-100 transition-colors duration-300"
          >
            Schedule Now
          </button>{" "}
        </div>
      </div>
    </div>
  );
};

export default TrustedSource;
