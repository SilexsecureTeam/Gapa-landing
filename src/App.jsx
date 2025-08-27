import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { Suspense, lazy } from "react";
import { HelmetProvider } from "@dr.pogodin/react-helmet";
import "./App.css";
import logo from "./assets/logo.png";
import ScrollToTop from "./components/ScrollToTop";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Calendar from "./components/Calendar";

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
const Book1Page = lazy(() => import("./Pages/Book1Page"));
const Book2Page = lazy(() => import("./Pages/Book2Page"));
const Book3Page = lazy(() => import("./Pages/Book3Page"));
const Book4Page = lazy(() => import("./Pages/Book4Page"));
const Book5Page = lazy(() => import("./Pages/Book5Page"));
const Success = lazy(() => import("./components/Success"));
const Suc = lazy(() => import("./components/Suc"));
const DashboardPage = lazy(() => import("./Pages/DashboardPage"));

function App() {
  return (
    <HelmetProvider>
      <Router>
        <div className="min-h-screen w-full">
          <ScrollToTop />
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
            <ToastContainer position="top-right" autoClose={3000} />
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
              <Route path="/book-first" element={<Book1Page />} />
              <Route path="/book-second" element={<Book2Page />} />
              <Route path="/book-third" element={<Book3Page />} />
              <Route path="/book-forth" element={<Book4Page />} />
              <Route path="/book-fifth" element={<Book5Page />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/success" element={<Success />} />
              <Route path="/suc" element={<Suc />} />
              <Route path="/dashboard/*" element={<DashboardPage />} />
              <Route path="*" element={<NotFoundPage />} />{" "}
              {/* Updated to use NotFoundPage */}
            </Routes>
          </Suspense>
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;
