import React from "react";
import Header from "../components/Header";
import SignIn from "../Auth/SignIn";
import Footer from "../components/Footer"

const SigninPage = () => {
  return (
    <div>
      <Header />
      <SignIn />
      <Footer />
    </div>
  );
};

export default SigninPage;
