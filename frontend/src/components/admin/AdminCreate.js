import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { BACKEND_URL_LINK } from '../../routes/url'


const AdminCreate = () => {
  const navigate = useNavigate();

  let AdminId = sessionStorage.getItem("AdminId");

  const [formData, setFormData] = useState({
    adminEmail: "",
    adminPassword: "",
    newAdminName: "",
    newAdminEmail: "",
    newAdminPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (!AdminId) {
    navigate("/admin/Login");
    return;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BACKEND_URL_LINK}/api/v4/createAdmin`, {
        adminEmail: formData.adminEmail,
        adminPassword: formData.adminPassword,
        newAdminData: {
          name: formData.newAdminName,
          email: formData.newAdminEmail,
          password: formData.newAdminPassword,
        },
      });

      if (response.status === 201) {
        toast("New admin created successfully!");
        setFormData({
          adminEmail: "",
          adminPassword: "",
          newAdminName: "",
          newAdminEmail: "",
          newAdminPassword: "",
        });
      }
    } catch (err) {
      toast(err.response?.data?.error || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center my-12 bg-gray-100 p-4">
      <ToastContainer />
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-6xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Create New Admin</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Horizontal Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Existing Admin Credentials */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Your Credentials</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Your Email</label>
                <input
                  type="email"
                  name="adminEmail"
                  value={formData.adminEmail}
                  onChange={handleChange}
                  placeholder="Your admin email"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Your Password</label>
                <input
                  type="password"
                  name="adminPassword"
                  value={formData.adminPassword}
                  onChange={handleChange}
                  placeholder="Your admin password"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* New Admin Details */}
            <div>
              <h3 className="text-lg font-semibold mb-4">New Admin Details</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">New Admin Name</label>
                <input
                  type="text"
                  name="newAdminName"
                  value={formData.newAdminName}
                  onChange={handleChange}
                  placeholder="New admin name"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">New Admin Email</label>
                <input
                  type="email"
                  name="newAdminEmail"
                  value={formData.newAdminEmail}
                  onChange={handleChange}
                  placeholder="New admin email"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">New Admin Password</label>
                <input
                  type="password"
                  name="newAdminPassword"
                  value={formData.newAdminPassword}
                  onChange={handleChange}
                  placeholder="New admin password"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600"
            >
              Create Admin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminCreate;
