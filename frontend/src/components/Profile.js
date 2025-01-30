import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom"

import axios from "axios";
import acc from '../assets/acc.jpg'
import map from '../assets/map.jpg'

import { BACKEND_URL_LINK } from '../routes/url'

const Profile = () => {
  const navigate = useNavigate();

  let userId = sessionStorage.getItem("Id");
  if(!userId) {
    navigate("/Login");
  }

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [addressData, setAddressData] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL_LINK}/api/v1/getUser/${userId}`
        );
        setUser(response.data);
        setFormData(response.data); // Pre-fill the form with current user data
        setAddressData(response.data.address || []); // Pre-fill address data
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddressChange = (e, index) => {
    const updatedAddresses = [...addressData];
    updatedAddresses[index] = e.target.value;
    setAddressData(updatedAddresses);
  };

  const addNewAddress = () => {
    setAddressData([...addressData, ""]);
  };

  const deleteAddress = (index) => {
    const updatedAddresses = addressData.filter((_, i) => i !== index);
    setAddressData(updatedAddresses);
  };

  const handleProfileFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${BACKEND_URL_LINK}/api/v1/updateUser/${userId}`,
        formData
      );
      setUser(response.data.user); // Update user with new data
      setIsProfileModalOpen(false);
      toast("Profile updated successfully!");
    } catch (err) {
      toast("Failed to update profile: " + err.message);
    }
  };

  const handleAddressFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (addressData.includes("")) {
        toast("Please fill the address");
        return;
      }
      const response = await axios.put(
        `${BACKEND_URL_LINK}/api/v1/updateUser/${userId}`,
        { address: addressData }
      );
      setUser(response.data.user); // Update user with new data
      setIsAddressModalOpen(false);
      toast("Address updated successfully!");
    } catch (err) {
      toast("Failed to update address: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500 text-lg">Error: {error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 text-lg">User not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 p-4">
      <ToastContainer />
      <div className="max-w-4xl mx-auto bg-white rounded-lg p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">User Profile</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <img
            src={acc}
            alt="Team Member"
            className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-full mb-4 "
          />
          {/* User Info */}
          <div className="text-left ml-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Personal Information</h2>
            <p className="text-gray-600"><strong>Name:</strong> {user.name}</p>
            <p className="text-gray-600"><strong>Email:</strong> {user.email}</p>
            <p className="text-gray-600"><strong>Mobile:</strong> {user.mobile}</p>
            <p className="text-gray-600"><strong>Age:</strong> {user.age}</p>
            <button
              className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => setIsProfileModalOpen(true)}
            >
              Update Profile
            </button>
          </div>
          </div>

          {/* Address */}
          <div className="grid grid-cols-1 mt-10 md:grid-cols-2 gap-6">
            <img
              src={map}
              alt="Team Member"
              className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-full mb-4 "
            />

            <div className="text-left ml-6">

              <h2 className="text-lg font-semibold text-gray-700 mb-2">Address</h2>
              {user.address.length > 0 ? (
                <ul className="list-disc list-inside text-gray-600">
                  {user.address.map((addr, index) => (
                    <li key={index}>{addr}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">No addresses available</p>
              )}
              <button
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={() => setIsAddressModalOpen(true)}
              >
                Update Address
              </button>
            </div>
        </div>
      </div>

      {/* Profile Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-96 rounded-lg  p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Update Profile</h2>
            <form onSubmit={handleProfileFormSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Mobile</label>
                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsProfileModalOpen(false)}
                className="w-full mt-2 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Address Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-96 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Update Address</h2>
            <form onSubmit={handleAddressFormSubmit}>
              {addressData.map((address, index) => (
                <div key={index} className="mb-4 flex items-center gap-2">
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => handleAddressChange(e, index)}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                  <button
                    type="button"
                    onClick={() => deleteAddress(index)}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addNewAddress}
                className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 mb-4"
              >
                Add Address
              </button>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsAddressModalOpen(false)}
                className="w-full mt-2 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
