import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Sidebar from "../components/Dashboard/Sidebar";
import Header from "../components/Dashboard/Header";
import Overview from "../components/Dashboard/Overview";
import ServiceHistory from "../components/Dashboard/ServiceHistory";
import Messages from "../components/Dashboard/Messages";
import Settings from "../components/Dashboard/Settings";
import SignOutModal from "../components/Dashboard/SignOutModal";
import Quote from "../components/Dashboard/Quote"; // Assuming Quote is moved to components/Dashboard

const DashboardPage = () => {
  const [open, setOpen] = useState(false); // Initialize as false (Sidebar closed)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOutClick = () => {
    setIsModalOpen(true);
  };

  const handleConfirmSignOut = () => {
    console.log("User signed out");
    setIsModalOpen(false);
    navigate("/signin");
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col overflow-y-hidden h-screen bg-[#f7f5ff]">
      {open && (
        <div
          className="fixed inset-0 bg-black/30 bg-opacity-40 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <Header open={open} setOpen={setOpen} />
      <div className="flex flex-1">
        <Sidebar open={open} setOpen={setOpen} onSignOut={handleSignOutClick} />
        <main
          className="flex-1 p-4 bg-white overflow-y-auto custom-scrollbar lg:ml-0"
          style={{
            height: "calc(100vh - 158px)",
          }}
        >
          <Routes>
            <Route index element={<Overview />} />
            <Route path="service-history" element={<ServiceHistory />} />
            <Route path="messages" element={<Messages />} />
            <Route path="settings" element={<Settings />} />
            <Route path="quote/:fleetName" element={<Quote />} />{" "}
            {/* New route */}
            <Route
              path="fleet"
              element={<div>Fleet Management Placeholder</div>}
            />
            <Route
              path="fleet/customers"
              element={<div>Customer List Placeholder</div>}
            />
            <Route
              path="fleet/assignments"
              element={<div>Fleet Assignments Placeholder</div>}
            />
            <Route
              path="fleet/expense-history"
              element={<div>Expense History Placeholder</div>}
            />
            <Route
              path="fleet/maintenance"
              element={<div>Fleet Maintenance Placeholder</div>}
            />
            <Route
              path="reminders"
              element={<div>Reminders Placeholder</div>}
            />
            <Route
              path="reminders/service"
              element={<div>Service Reminder Placeholder</div>}
            />
            <Route
              path="reminders/add-service"
              element={<div>Add Service Reminder Placeholder</div>}
            />
            <Route
              path="reminders/items"
              element={<div>Service Items Placeholder</div>}
            />
            <Route path="help" element={<div>Get Help Placeholder</div>} />
          </Routes>
          <SignOutModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onConfirm={handleConfirmSignOut}
          />
        </main>
      </div>
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #6b46c1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #553c9a;
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #6b46c1 #f1f1f1;
        }
        @media (max-width: 1024px) {
          /* lg breakpoint */
          main {
            height: calc(100vh - 90px) !important;
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardPage;
