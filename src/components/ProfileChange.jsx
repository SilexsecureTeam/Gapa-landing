import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { User, ArrowLeft } from "lucide-react";
import logo from "../assets/logo.png";

const ProfileChange = () => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("Please log in to view your profile.", {
          action: { label: "Log In", onClick: () => navigate("/signin") },
        });
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get("https://api.gapafix.com.ng/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("User response:", response.data); // Log for debugging
        const userData = response.data.data || response.data;
        setForm({
          name: userData.name || "",
          phone: userData.phone || "",
          email: userData.email || "",
          password: "",
          password_confirmation: "",
        });
      } catch (err) {
        console.error("Error fetching user:", {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
        });
        if (err.response?.status === 401) {
          localStorage.removeItem("authToken");
          toast.error("Session expired. Please log in again.", {
            action: { label: "Log In", onClick: () => navigate("/signin") },
          });
        }
        // Removed: toast.error("Failed to load profile. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Please log in to update your profile.", {
        action: { label: "Log In", onClick: () => navigate("/signin") },
      });
      return;
    }

    // Validate password and password_confirmation
    if (form.password && form.password !== form.password_confirmation) {
      toast.error("Passwords do not match.");
      return;
    }

    // Create form-data payload
    const formData = new FormData();
    if (form.name) formData.append("name", form.name);
    if (form.phone) formData.append("phone", form.phone);
    if (form.password) {
      formData.append("password", form.password);
      formData.append("password_confirmation", form.password_confirmation);
    }
    formData.append("_method", "PATCH"); // Simulate PATCH with POST

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        "https://api.gapafix.com.ng/api/user/update",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Update response:", response.data);
      toast.success("Profile updated successfully!");
      setForm((prev) => ({ ...prev, password: "", password_confirmation: "" })); // Clear password fields
    } catch (err) {
      console.error("Error updating profile:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
      if (err.response?.status === 401) {
        localStorage.removeItem("authToken");
        toast.error("Session expired. Please log in again.", {
          action: { label: "Log In", onClick: () => navigate("/signin") },
        });
      } else {
        toast.error(
          err.response?.data?.message ||
            "Failed to update profile. Please try again."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-6 lg:px-20 md:px-16 sm:px-12 px-4">
      <header className="bg-[#F2F2F2] rounded-xl mb-3">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <img src={logo} alt="CarFlex Logo" className="h-12" />
              <h2 className="text-lg font-semibold text-[#575757]">
                Your Profile
              </h2>
            </div>
            <button
              onClick={() => navigate("/vehicle-dashboard")}
              className="flex items-center space-x-2 text-[#492F92] hover:text-[#3b2371] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back to Dashboard</span>
            </button>
          </div>
        </div>
      </header>

      <div className="w-full max-w-2xl mx-auto py-8">
        {isLoading ? (
          <div className="text-center py-6">
            <p className="text-gray-500 text-sm">Loading profile...</p>
          </div>
        ) : (
          <div className="bg-[#F4F4F4] rounded-xl border border-[#EBEBEB] p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-[#575757] mb-4 flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Update Profile</span>
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full bg-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#492F92] transition-colors"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full bg-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#492F92] transition-colors"
                  placeholder="Enter your phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Email (Read-only)
                </label>
                <input
                  type="email"
                  value={form.email}
                  disabled
                  className="w-full bg-gray-200 rounded-md px-3 py-2 text-gray-500 cursor-not-allowed"
                  placeholder="Your email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  New Password (Optional)
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full bg-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#492F92] transition-colors"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Confirm New Password (Optional)
                </label>
                <input
                  type="password"
                  name="password_confirmation"
                  value={form.password_confirmation}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full bg-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#492F92] transition-colors"
                  placeholder="Confirm new password"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-[#492F92] text-white py-2 rounded-full text-sm hover:bg-[#3b2371] transition-colors ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Updating..." : "Update Profile"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileChange;
