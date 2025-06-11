import React from "react";
import Header from "../components/Header.jsx";
import Newsletter from "../components/Newsletter.jsx";
import Footer from "../components/Footer.jsx";
import Serve from "../components/Serve.jsx";

const ServicePage = () => {
  return (
    <div>
      <Header />
      <Serve />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default ServicePage;
