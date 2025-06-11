import React from "react";
import Header from "../components/Header.jsx";
import Newsletter from "../components/Newsletter.jsx";
import Footer from "../components/Footer.jsx";
import About from "../components/About.jsx";
import BrandSection from "../components/BrandSection.jsx";

const AboutPage = () => {
  return (
    <div>
      <Header />
      <About />
      <BrandSection />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default AboutPage;
