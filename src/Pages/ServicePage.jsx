import React from "react";
import Header from "../components/Header.jsx";
import Newsletter from "../components/Newsletter.jsx";
import Footer from "../components/Footer.jsx";
import Serve from "../components/Serve.jsx";
import AutomotiveTestimonials from "../components/AutomotiveTestimonials.jsx";

const ServicePage = () => {
  return (
    <div>
      <Header />
      <Serve />
      <AutomotiveTestimonials />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default ServicePage;
