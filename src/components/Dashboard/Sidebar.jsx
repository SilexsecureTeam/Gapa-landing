import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  MapPin,
  MessageSquare,
  HelpCircle,
  Settings,
  ChevronDown,
  ChevronRight,
  LogOut,
} from "lucide-react";

const Sidebar = ({ open, setOpen, onSignOut }) => {
  const [isFleetExpanded, setIsFleetExpanded] = useState(true);
  const [isRemindersExpanded, setIsRemindersExpanded] = useState(true);

  const navLinks = [
    { name: "Dashboard", icon: <Home size={20} />, path: "/dashboard" },
    {
      name: "Fleet Management",
      icon: <MapPin size={20} />,
      path: "/dashboard/fleet",
      subLinks: [
        { name: "Customer List", path: "/dashboard/fleet/customers" },
        { name: "Fleet Assignments", path: "/dashboard/fleet/assignments" },
        { name: "Expense History", path: "/dashboard/fleet/expense-history" },
        { name: "Fleet Maintenance", path: "/dashboard/fleet/maintenance" },
      ],
    },
    {
      name: "Reminders",
      icon: <MessageSquare size={20} />,
      path: "/dashboard/reminders",
      subLinks: [
        { name: "Service Reminder", path: "/dashboard/reminders/service" },
        {
          name: "Add Service Reminder",
          path: "/dashboard/reminders/add-service",
        },
        { name: "Service Items", path: "/dashboard/reminders/items" },
      ],
    },
    {
      name: "Get Help",
      icon: <HelpCircle size={20} />,
      path: "/dashboard/help",
    },
    {
      name: "Settings",
      icon: <Settings size={20} />,
      path: "/dashboard/settings",
    },
  ];

  return (
    <aside
      className={`fixed lg:static bg-white top-[48px] left-0 w-64 transition-all duration-300 z-50 border-r border-gray-200 flex flex-col h-[calc(100vh-48px)] overflow-y-auto p-2 pr-0 custom-scrollbar ${
        open ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 lg:top-0 lg:h-[calc(100vh-158px)]`}
    >
      <nav className="flex flex-col flex-1 pr-4">
        <div className="space-y-2">
          {navLinks.map((link) => (
            <div key={link.name}>
              <NavLink
                to={link.path}
                end={link.name === "Dashboard"}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded-lg cursor-pointer ${
                    isActive
                      ? "bg-purple-200 text-purple-700"
                      : "text-gray-600 hover:bg-gray-50"
                  }`
                }
                onClick={() => {
                  console.log("NavLink clicked, closing Sidebar");
                  setOpen(false);
                  if (link.subLinks) {
                    if (link.name === "Fleet Management") {
                      setIsFleetExpanded(!isFleetExpanded);
                    } else if (link.name === "Reminders") {
                      setIsRemindersExpanded(!isRemindersExpanded);
                    }
                  }
                }}
              >
                {link.icon}
                <span className="text-sm font-medium flex-1">{link.name}</span>
                {link.subLinks &&
                  ((link.name === "Fleet Management" && isFleetExpanded) ||
                  (link.name === "Reminders" && isRemindersExpanded) ? (
                    <ChevronDown size={16} className="text-gray-400" />
                  ) : (
                    <ChevronRight size={16} className="text-gray-400" />
                  ))}
              </NavLink>

              {link.subLinks &&
                ((link.name === "Fleet Management" && isFleetExpanded) ||
                  (link.name === "Reminders" && isRemindersExpanded)) && (
                  <div className="ml-8 mt-1 space-y-1">
                    {link.subLinks.map((subLink) => (
                      <NavLink
                        key={subLink.name}
                        to={subLink.path}
                        className={({ isActive }) =>
                          `block p-2 text-sm rounded cursor-pointer ${
                            isActive
                              ? "border-l-2 border-purple-600 text-purple-600"
                              : "text-gray-600 hover:bg-gray-50"
                          }`
                        }
                        onClick={() => {
                          console.log("SubLink clicked, closing Sidebar");
                          setOpen(false);
                        }}
                      >
                        {subLink.name}
                      </NavLink>
                    ))}
                  </div>
                )}
            </div>
          ))}
        </div>

        <div className="mt-auto p-4 space-y-2">
          <button
            onClick={() => {
              console.log("Log Out clicked, closing Sidebar");
              onSignOut();
              setOpen(false);
            }}
            className="flex items-center gap-3 p-3 text-red-500 hover:bg-red-100 rounded-lg w-full"
          >
            <LogOut size={20} />
            <span className="text-sm font-medium">Log Out</span>
          </button>
        </div>
      </nav>
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
          margin-right: 0;
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
      `}</style>
    </aside>
  );
};

export default Sidebar;
