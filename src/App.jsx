import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { Suspense, lazy } from "react";
import "./App.css";
import logo from "./assets/logo.png";

// Lazy-loaded pages
const HomePage = lazy(() => import("./Pages/HomePage"));
const ContactPage = lazy(() => import("./Pages/ContactPage"));
const NotFoundPage = lazy(() => import("./Pages/NotFoundPage"));
const TeamPage = lazy(() => import("./Pages/TeamPage"));
const AboutPage = lazy(() => import("./Pages/AboutPage"));
const ServicePage = lazy(() => import("./Pages/ServicePage"));
const SignupPage = lazy(() => import("./Pages/SignupPage"));
const SigninPage = lazy(() => import("./Pages/SigninPage"));
const ProfilePage = lazy(() => import("./Pages/ProfilePage"));
const ProfileMecPage = lazy(() => import("./Pages/ProfileMecPage"));

function App() {
  return (
    <Router>
      <div className="min-h-screen w-full">
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
              <div className="relative">
                <img
                  src={logo}
                  alt="Loading logo"
                  className="w-20 h-20 animate-scale-pulse relative z-10"
                />
              </div>
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/service" element={<ServicePage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/signin" element={<SigninPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile-mec" element={<ProfileMecPage />} />
            <Route path="*" element={<NotFoundPage />} />{" "}
            {/* Updated to use NotFoundPage */}
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
