import { Helmet } from "@dr.pogodin/react-helmet";
import React from "react";
import Header from "../components/Header.jsx";
import Newsletter from "../components/Newsletter.jsx";
import Footer from "../components/Footer.jsx";
import Serve from "../components/Serve.jsx";
import AutomotiveTestimonials from "../components/AutomotiveTestimonials.jsx";

const ServicePage = () => {
  return (
    <div>
      <Helmet>
        <title>
          Services | GAPA Fix – Auto Repairs & Genuine Spare Parts in Lagos
        </title>
        <meta
          name="description"
          content="Explore GAPA Fix’s full suite of auto repair and maintenance services in Lagos. From oil service, brake system repairs, diagnostics, engine checks, wheel alignment, suspension, tyre change, detailing, paint & bodywork – all with genuine spare parts and advanced part-matching technology"
        />
      </Helmet>

      <Header />
      <Serve />
      <AutomotiveTestimonials />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default ServicePage;
