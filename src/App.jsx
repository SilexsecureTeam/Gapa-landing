import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import React, { Suspense, lazy } from "react";
import { Helmet } from "react-helmet";
import "./App.css";
import logo from "./assets/logo.png";
import ScrollToTop from "./components/ScrollToTop";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Calendar from "./components/Calendar";
import FloatingContact from "./components/FloatingContact";
import ProtectedRoute from "./Auth/ProtectedRoute";

// Lazy-loaded pages
const HomePage = lazy(() => import("./Pages/HomePage"));
const ContactPage = lazy(() => import("./Pages/ContactPage"));
const NotFoundPage = lazy(() => import("./Pages/NotFoundPage"));
const TeamPage = lazy(() => import("./Pages/TeamPage"));
const AboutPage = lazy(() => import("./Pages/AboutPage"));
const ServicePage = lazy(() => import("./Pages/ServicePage"));
const SigninPage = lazy(() => import("./Pages/SigninPage"));
const ProfilePage = lazy(() => import("./Pages/ProfilePage"));
const ProfileMecPage = lazy(() => import("./Pages/ProfileMecPage"));
const Book1Page = lazy(() => import("./Pages/Book1Page"));
const Book2Page = lazy(() => import("./Pages/Book2Page"));
const Book3Page = lazy(() => import("./Pages/Book3Page"));
const Book4Page = lazy(() => import("./Pages/Book4Page"));
const Book5Page = lazy(() => import("./Pages/Book5Page"));
const PrivacyPage = lazy(() => import("./Pages/PrivacyPage"));
const Success = lazy(() => import("./components/Success"));
const Suc = lazy(() => import("./components/Suc"));
const VehicleDashboard = lazy(() => import("./components/VehicleDashboard"));
const DashboardPage = lazy(() => import("./Pages/DashboardPage"));
const ForgetPasswordPage = lazy(() => import("./Pages/ForgetPasswordPage"));
const ResetPasswordPage = lazy(() => import("./Pages/ResetPasswordPage"));
const Invoice = lazy(() => import("./components/Invoice"));
const ProfileChange = lazy(() => import("./components/ProfileChange"));
const BookService = lazy(() => import("./components/BookService"));
const AdminDashboard = lazy(() => import("./components/AdminDashboard"));
const PaymentRedirectHandler = lazy(() =>
  import("./components/PaymentRedirectHandler")
);

function App() {
  const location = useLocation();
  const hideFloating = location.pathname.includes("dashboard");

  return (
    <div className="min-h-screen w-full">
      <Helmet>
        <title>Gapa Fix | Fast & Reliable Fix Services</title>
        <meta
          name="description"
          content="Gapa Fix provides fast, reliable, and affordable home and office repair services. Book a professional today!"
        />
        <meta
          name="keywords"
          content="Gapa Fix, home repair, office repair, handyman, fixing services, maintenance"
        />
        <meta name="author" content="Gapa Fix Team" />
        {/* Open Graph */}
        <meta
          property="og:title"
          content="Gapa Fix | Fast & Reliable Fix Services"
        />
        <meta
          property="og:description"
          content="Get professional home and office repair services with Gapa Fix. Quick, affordable, and reliable."
        />
        <meta property="og:image" content="/logo.png" />
        <meta property="og:url" content="https://gapa-fix.com" />
        <meta property="og:type" content="website" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Gapa Fix | Fast & Reliable Fix Services"
        />
        <meta
          name="twitter:description"
          content="Book trusted repair professionals with Gapa Fix today."
        />
        <meta name="twitter:image" content="/logo.png" />
      </Helmet>
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
          <Route path="/signin" element={<SigninPage />} />
          <Route path="/forgot-password" element={<ForgetPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
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
          <Route path="/privacy" element={<PrivacyPage />} />
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard/*" element={<DashboardPage />} />
            <Route path="/vehicle-dashboard" element={<VehicleDashboard />} />
            <Route
              path="/payment-callback"
              element={<PaymentRedirectHandler />}
            />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/book-service" element={<BookService />} />
            <Route path="/booking/:bookingId/invoice" element={<Invoice />} />
            <Route path="/profile-change" element={<ProfileChange />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      {!hideFloating && <FloatingContact />}
    </div>
  );
}

// Wrap App in Router so `useLocation` works
export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
