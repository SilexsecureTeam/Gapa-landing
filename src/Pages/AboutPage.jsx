import React from "react";
import Header from "../components/Header.jsx";
import Newsletter from "../components/Newsletter.jsx";
import Footer from "../components/Footer.jsx";
import About from "../components/About.jsx";

const AboutPage = () => {
  return (
    <div>
      <Header />
      <About />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default AboutPage;
