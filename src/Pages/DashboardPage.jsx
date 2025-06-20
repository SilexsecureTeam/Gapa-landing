import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "../components/Dashboard/Sidebar";
import Header from "../components/Dashboard/Header";
import Overview from "../components/Dashboard/Overview";
// import Vehicles from "../components/Dashboard/Vehicles";
// import BookService from "../components/Dashboard/BookService";
// import ServiceHistory from "../components/Dashboard/ServiceHistory";
// import TrackProgress from "../components/Dashboard/TrackProgress";
// import Messages from "../components/Dashboard/Messages";
// import Settings from "../components/Dashboard/Settings";

const DashboardPage = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#f7f5ff]">
      <Sidebar open={open} setOpen={setOpen} />
      <div className="flex flex-col flex-1">
        <Header open={open} setOpen={setOpen} />
        <main className="flex-1 p-4 overflow-auto">
          <Routes>
            <Route index element={<Overview />} />
            {/* <Route path="vehicles" element={<Vehicles />} /> */}
            {/* <Route path="book-service" element={<BookService />} /> */}
            {/* <Route path="service-history" element={<ServiceHistory />} /> */}
            {/* <Route path="track-progress" element={<TrackProgress />} /> */}
            {/* <Route path="messages" element={<Messages />} /> */}
            {/* <Route path="settings" element={<Settings />} /> */}
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
