import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";
import { Audio } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";

import { BACKEND_URL_LINK } from '../../routes/url'

const AdminResult = () => {
  const navigate = useNavigate();
  const AdminId = sessionStorage.getItem("AdminId");
  

  const [results, setResults] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    images: [],
  });
  const [editingResult, setEditingResult] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false); // State to manage loading

  // Fetch all results
  useEffect(() => {
    if (!AdminId) {
      navigate("/admin/Login");
    }
    const fetchResults = async () => {
      setLoading(true); // Start loading
      try {
        const response = await axios.get(`${BACKEND_URL_LINK}/api/v5/getAllResults`);
        setResults(response.data);
      } catch (error) {
        console.error("Error fetching results:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };
    fetchResults();
  },[]);


  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "images" && files) {
      setFormData({ ...formData, images: Array.from(files) }); // Store all selected images in an array
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Add or update result
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "images" && formData.images.length === 0) return;
        if (key === "images") {
          formData.images.forEach((image) => formDataToSend.append('images', image)); // Append all selected images
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      if (editingResult) {
        await axios.put(
          `${BACKEND_URL_LINK}/api/v5/updateResult/${editingResult._id}`,
          formDataToSend,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        toast("Result updated successfully!");
      } else {
        await axios.post(`${BACKEND_URL_LINK}/api/v5/addResult`, formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast("Result added successfully!");
      }

      setFormData({
        name: "",
        description: "",
        images: [],
      });
      setEditingResult(null);
      fetchResults();
      setShowForm(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Delete result
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this result?");
    if (confirmDelete) {
      setLoading(true); // Start loading
      try {
        await axios.delete(`${BACKEND_URL_LINK}/api/v5/deleteResult/${id}`);
        toast("Result deleted successfully!");
        fetchResults();
      } catch (error) {
        console.error("Error deleting result:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    }
  };

  // Edit result
  const handleEdit = (result) => {
    setEditingResult(result);
    setFormData({
      name: result.name,
      description: result.description,
      images: [], // Set to empty since we're editing
    });
    setShowForm(true);
  };

  return (
    <div className="relative flex flex-cols w-[80%] mx-auto">
      <ToastContainer />
      {/* Loader Overlay */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <Audio height="80" width="80" color="green" ariaLabel="loading" />
        </div>
      )}

      {/* Main Content */}
      <div className={loading ? "opacity-50 pointer-events-none" : ""}>
        <h1 className="text-2xl font-bold mb-4">Results</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {results.map((result) => (
            <div key={result._id} className="p-4 bg-white rounded">
              {/* Image Section */}
              <div className="flex flex-col gap-4 sm:flex-row sm:gap-4 w-full md:flex-nowrap animate-fade-in-right">
                {result.image && result.image.slice(0, 4).map((imgSrc, index) => (
                  <div
                    key={index}
                    className="group flex-1 transition-all duration-300 hover:flex-[3] sm:hover:flex-[2]"
                  >
                    <img
                      src={imgSrc}
                      alt={`Result ${index + 1}`}
                      className="w-full h-64 sm:h-80 md:h-96 rounded-lg object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                ))}
              </div>

              <h2 className="font-bold mt-4">{result.name}</h2>
              <p className="text-justify">{result.description}</p>
              <div className="flex justify-between mt-2">
                <button
                  onClick={() => handleEdit(result)}
                  className="bg-yellow-500 rounded border border-black border-2 text-white px-2 py-1 mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(result._id)}
                  className="bg-red-500 rounded border border-black border-2 text-white px-2 py-1 mr-2"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="m-4 bg-green-500 text-white px-4 py-2 rounded"
            >
              Add Result
            </button>
          )}
        </div>

        {/* Add Result Button */}
      </div>

      {/* Popup Modal for Add/Edit Result Form */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40">
          <div className="max-w-lg p-6 bg-white rounded-lg relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4">
              {editingResult ? "Edit Result" : "Add Result"}
            </h2>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Name"
                className="w-full p-2 border rounded"
                required
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Description"
                className="w-full p-2 border rounded"
                rows={5}
                required
              ></textarea>
              <label className="block text-red-500 font-bold">Choose 4 Images</label>
              <input
                type="file"
                name="images"
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                multiple // Allows multiple file selection
              />
              <div className="grid grid-cols-2 gap-2 mt-4">
                {formData.images.length > 0 && (
                  formData.images.map((file, index) => (
                    <img key={index} src={URL.createObjectURL(file)} alt="preview" className="w-24 h-24 object-cover rounded" />
                  ))
                )}
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                >
                  Cancel
                </button>
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                  {editingResult ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminResult;
