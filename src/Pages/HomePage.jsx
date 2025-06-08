import React from "react";
import Header from "../components/Header.jsx";
import Hero from "../components/Hero.jsx";
import Trust from "../components/Trust.jsx";
import Service from "../components/Service.jsx";
import BrandSection from "../components/BrandSection.jsx";
import Work from "../components/Work.jsx";
import CustomerReviews from "../components/CustomerReviews.jsx";
import Car from "../components/Car.jsx";
import RecentServices from "../components/RecentServices.jsx";
import Article from "../components/Article.jsx";
import Newsletter from "../components/Newsletter.jsx";
import Footer from "../components/Footer.jsx";

const HomePage = () => {
  return (
    <div>
      <Header />
      <Hero />
      <Trust />
      <Service />
      <BrandSection />
      <Work />
      <CustomerReviews />
      <Car />
      <RecentServices />
      <Article />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default HomePage;
