import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("authToken");
  const user = localStorage.getItem("user");

  // Check if both token and user exist
  const isAuthenticated = token && user;

  if (!isAuthenticated) {
    // Redirect to signin, passing the current location to redirect back after login
    return (
      <Navigate
        to="/signin"
        state={{ from: window.location.pathname }}
        replace
      />
    );
  }

  // If children are provided, render them (for single routes)
  // Otherwise, render Outlet for nested routes (e.g., /dashboard/*)
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
