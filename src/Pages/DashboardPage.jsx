// src/pages/DashboardPage.jsx
import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Sidebar from "../components/Dashboard/Sidebar";
import Header from "../components/Dashboard/Header";
import Overview from "../components/Dashboard/Overview";
// import Vehicles from "../components/Dashboard/Vehicles";
// import BookService from "../components/Dashboard/BookService";
import ServiceHistory from "../components/Dashboard/ServiceHistory";
// import TrackProgress from "../components/Dashboard/TrackProgress";
// import Messages from "../components/Dashboard/Messages";
import Settings from "../components/Dashboard/Settings";

import SignOutModal from "../components/Dashboard/SignOutModal";

const DashboardPage = () => {
  const [open, setOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOutClick = () => {
    setIsModalOpen(true);
  };

  const handleConfirmSignOut = () => {
    // Perform sign-out logic (e.g., clear tokens)
    console.log("User signed out");
    setIsModalOpen(false);
    navigate("/signin");
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex h-screen overflow-auto bg-[#f7f5ff]">
      <Sidebar open={open} setOpen={setOpen} onSignOut={handleSignOutClick} />
      <div className="flex flex-col flex-1">
        <Header open={open} setOpen={setOpen} />
        <main className="flex-1 p-4 overflow-auto">
          <Routes>
            <Route index element={<Overview />} />
            {/* <Route path="vehicles" element={<Vehicles />} /> */}
            {/* <Route path="book-service" element={<BookService />} /> */}
            <Route path="service-history" element={<ServiceHistory />} />
            {/* <Route path="track-progress" element={<TrackProgress />} /> */}
            {/* <Route path="messages" element={<Messages />} /> */}
            <Route path="settings" element={<Settings />} />
          </Routes>
          <SignOutModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onConfirm={handleConfirmSignOut}
          />
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
