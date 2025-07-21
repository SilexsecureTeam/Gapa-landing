// import React from "react";
import Header from "../components/Header";
import Newsletter from "../components/Newsletter";
import Footer from "../components/Footer";
import heroBg from "../assets/cont.png";
import Contact from "../components/Contact";

const ContactPage = () => {
  return (
    <div>
      <Header />
      <div className="lg:px-10 md:px-8 sm:px-6 px-2 ">
        <section
          className="relative bg-cover bg-center h-[50vh] md:h-[70vh] flex items-center justify-start text-white lg:px-10 md:px-8 sm:px-6 px-2"
          style={{ backgroundImage: `url(${heroBg})` }}
        >
          {/* Overlay (optional for darkening the background) */}
          <div className="absolute inset-0 bg-black/30 z-0"></div>

          {/* Content */}
          <div className="relative z-10  ">
            <h1 className="text-2xl sm:text-3xl md:text-5xl poppins uppercase leading-tight  md:text-start text-center font-semibold mb-2 text-[#E5E5E5]">
              Contact Us
            </h1>
            <p className="text-base font-normal sm:text-lg md:text-xl  text-[#E5E5E5]">
              Let’s get your car the care it deserves
            </p>
          </div>
        </section>
        <Contact />
      </div>
      <Newsletter />
      <Footer />
    </div>
  );
};

export default ContactPage;
