import React, { useRef } from "react";
import Header from "../components/Header.jsx";
import Hero from "../components/Hero.jsx";
import Service from "../components/Service.jsx";
import BrandSection from "../components/BrandSection.jsx";
import Work from "../components/Work.jsx";
import CustomerReviews from "../components/CustomerReviews.jsx";
import Car from "../components/Car.jsx";
import Newsletter from "../components/Newsletter.jsx";
import Footer from "../components/Footer.jsx";
import TrustedSource from "../components/TrustedSource.jsx";
import { Helmet } from "@dr.pogodin/react-helmet";

const HomePage = () => {
  const trustRef = useRef(null);

  const scrollToTrust = () => {
    trustRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      <Helmet>
        <title>
          GAPA Fix | Expert Car Repairs & Genuine Auto Spare Parts in Lagos
        </title>
        <meta
          name="description"
          content="Discover GAPA Fix – your trusted destination in Lagos for professional car repairs, maintenance, and authentic auto spare parts. Quality service, genuine parts, and reliable support to keep your vehicle running smoothly"
        />
      </Helmet>
      <Header />
      <Hero ref={trustRef} /> {/* Pass trustRef to Hero */}
      <TrustedSource onScheduleClick={scrollToTrust} />
      <Service />
      <BrandSection />
      <Work />
      <CustomerReviews />
      <Car />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default HomePage;
