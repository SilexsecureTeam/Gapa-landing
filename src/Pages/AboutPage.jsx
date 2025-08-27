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
        {/* Open Graph / WhatsApp preview */}
        <meta property="og:title" content="About Us | GAPA Fix – Car Repairs & Genuine Auto Spare Parts in Lagos" />
        <meta property="og:description" content="Learn more about GAPA Fix, Lagos’s premier destination for expert car repairs and authentic auto spare parts. Discover our mission, values, and commitment to keeping your vehicle safe and reliable" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourwebsite.com/about" />
        <meta property="og:image" content="https://yourwebsite.com/assets/og-about.jpg" />

        {/* Twitter card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Us | GAPA Fix – Car Repairs & Genuine Auto Spare Parts in Lagos" />
        <meta name="twitter:description" content="Learn more about GAPA Fix, Lagos’s premier destination for expert car repairs and authentic auto spare parts. Discover our mission, values, and commitment to keeping your vehicle safe and reliable" />
        <meta name="twitter:image" content="https://yourwebsite.com/assets/og-about.jpg" />
        
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
