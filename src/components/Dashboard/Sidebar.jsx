import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Car,
  ClipboardCheck,
  History,
  Wrench,
  MessageCircle,
  Settings,
  LogOut,
} from "lucide-react";

const navLinks = [
  { name: "Dashboard", icon: <LayoutDashboard />, path: "/dashboard" },
  { name: "Vehicles", icon: <Car />, path: "/dashboard/vehicles" },
  { name: "Book a Service", icon: <ClipboardCheck />, path: "/dashboard/book-service" },
  { name: "Service History", icon: <History />, path: "/dashboard/service-history" },
  { name: "Track Progress", icon: <Wrench />, path: "/dashboard/track-progress" },
  { name: "Messages", icon: <MessageCircle />, path: "/dashboard/messages" },
  { name: "Settings", icon: <Settings />, path: "/dashboard/settings" },
];

const Sidebar = () => {
  return (
    <aside className="w-60 bg-white p-5 shadow-md h-screen sticky top-0">
      <h2 className="text-2xl font-bold mb-6 text-center">GaragePro</h2>
      <nav className="flex flex-col gap-4">
        {navLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-md font-medium ${
                isActive ? "bg-purple-100 text-purple-700" : "text-gray-600"
              }`
            }
          >
            {link.icon}
            {link.name}
          </NavLink>
        ))}
        <NavLink
          to="/"
          className="flex items-center gap-3 px-4 py-2 mt-8 text-red-500 hover:bg-red-100 rounded-md"
        >
          <LogOut /> Log Out
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
