// Sidebar.jsx
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
import logo from "../../assets/logo.png";

const navLinks = [
  { name: "Dashboard", icon: <LayoutDashboard />, path: "/dashboard" },
  { name: "Vehicles", icon: <Car />, path: "/dashboard/vehicles" },
  {
    name: "Book a Service",
    icon: <ClipboardCheck />,
    path: "/dashboard/book-service",
  },
  {
    name: "Service History",
    icon: <History />,
    path: "/dashboard/service-history",
  },
  {
    name: "Track Progress",
    icon: <Wrench />,
    path: "/dashboard/track-progress",
  },
  { name: "Messages", icon: <MessageCircle />, path: "/dashboard/messages" },
  { name: "Settings", icon: <Settings />, path: "/dashboard/settings" },
];

const Sidebar = ({ open, setOpen }) => {
  return (
    <aside
      className={`fixed lg:static bg-white shadow-md h-full min-h-screen w-60 p-5 transition-all duration-300 z-50 ${
        open ? "left-0" : "-left-full"
      } lg:left-0`}
    >
      <img src={logo} alt="logo" className="w-20 md:w-30 mx-auto mb-6" />
      <nav className="flex flex-col gap-4">
        {navLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-md font-medium ${
                isActive
                  ? "bg-purple-200 text-purple-700"
                  : "text-gray-600 hover:bg-purple-100 hover:text-purple-500"
              }`
            }
            onClick={() => setOpen(false)}
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
