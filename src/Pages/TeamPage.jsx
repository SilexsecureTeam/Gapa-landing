// import React from "react";
import Header from "../components/Header";
import Newsletter from "../components/Newsletter";
import Footer from "../components/Footer";
import heroBg from "../assets/team.png";
import Team from "../components/Team";

const TeamPage = () => {
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
        </section>
        <Team />
      </div>
      <Newsletter />
      <Footer />
    </div>
  );
};

export default TeamPage;
