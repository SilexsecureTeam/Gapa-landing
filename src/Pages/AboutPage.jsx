import { Helmet } from "@dr.pogodin/react-helmet";
import React from "react";
import Header from "../components/Header.jsx";
import Newsletter from "../components/Newsletter.jsx";
import Footer from "../components/Footer.jsx";
import About from "../components/About.jsx";
import Choose from "../components/Choose.jsx";

const AboutPage = () => {
  return (
    <div>
      <Helmet>
        <title>
          About Us | GAPA Fix – Car Repairs & Genuine Auto Spare Parts in Lagos
        </title>
        <meta
          name="description"
          content="Learn more about GAPA Fix, Lagos’s premier destination for expert car repairs and authentic auto spare parts. Discover our mission, values, and commitment to keeping your vehicle safe and reliable"
        />
      </Helmet>

      <Header />
      <About />
      <Choose />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default AboutPage;
