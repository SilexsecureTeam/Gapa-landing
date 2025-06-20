import React from "react";
import Header from "../components/Header.jsx";
import Newsletter from "../components/Newsletter.jsx";
import Footer from "../components/Footer.jsx";
import About from "../components/About.jsx";
import Choose from "../components/Choose.jsx";

const AboutPage = () => {
  return (
    <div>
      <Header />
      <About />
      <Choose />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default AboutPage;
