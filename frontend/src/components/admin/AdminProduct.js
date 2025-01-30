import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";
import { Audio } from "react-loader-spinner";

import { useNavigate } from "react-router-dom";

import { BACKEND_URL_LINK } from '../../routes/url'
const AdminProduct = () => {
  
  const navigate = useNavigate();

  let AdminId = sessionStorage.getItem("AdminId");

  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    composition: "",
    dosage: "",
    packing: "",
    image: null,
    benefits: "",
    target: "",
    price: "",
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false); // State to manage loading

  // Fetch all products
  useEffect(() => {
    if (!AdminId) {
      navigate("/admin/Login");
      return;
    }
    fetchProducts();
  }, []);
  
  const fetchProducts = async () => {
    setLoading(true); // Start loading
    try {
      const response = await axios.get(`${BACKEND_URL_LINK}/api/v2/getAllProduct`);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files) {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Add or update product
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "image" && !formData.image) return;
        formDataToSend.append(key, formData[key]);
      });

      if (editingProduct) {
        await axios.put(
          `${BACKEND_URL_LINK}/api/v2/updateProduct/${editingProduct._id}`,
          formDataToSend,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        toast("Product updated successfully!");
      } else {
        await axios.post(`${BACKEND_URL_LINK}/api/v2/addProduct`, formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast("Product added successfully!");
      }

      setFormData({
        name: "",
        composition: "",
        dosage: "",
        packing: "",
        image: null,
        benefits: "",
        target: "",
        price: "",
      });
      setEditingProduct(null);
      fetchProducts();
      setShowForm(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Delete product
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (confirmDelete) {
      setLoading(true); // Start loading
      try {
        await axios.delete(`${BACKEND_URL_LINK}/api/v2/deleteProduct/${id}`);
        toast("Product deleted successfully!");
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    }
  };

  // Edit product
  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      ...product,
      image: null,
    });
    setShowForm(true);
  };

  return (
    <div className="relative flex flex-cols w-[80%] mx-auto">
      <ToastContainer/>
      {/* Loader Overlay */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <Audio height="80" width="80" color="green" ariaLabel="loading" />
        </div>
      )}

      {/* Main Content */}
      <div className={loading ? "opacity-50 pointer-events-none" : ""}>
        <h1 className="text-2xl font-bold mb-4">Products</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <div  key={product._id} className="p-4 bg-white rounded">
              <div onClick={()=> navigate("/admin/productDetails/"+product._id)} >
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded mb-2"
                />
              )}
              <h2 className="font-bold">{product.name}</h2>
              <p>Price: {product.price}</p>
              <p>Composition: {product.composition}</p>
              </div>
              <div className="flex justify-between mt-2">
                <button
                  onClick={() => handleEdit(product)}
                  className="bg-yellow-600 rounded border border-black border-2 text-white p-4 py-1 mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product._id)}
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
              Add Product
            </button>
          )}
        </div>

        {/* Add Product Button */}
      </div>

      {/* Popup Modal for Add/Edit Product Form */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40">
          <div className="max-w-lg p-6 bg-white rounded-lg relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4">{editingProduct ? "Edit Product" : "Add Product"}</h2>
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
              <input
                type="text"
                name="composition"
                value={formData.composition}
                onChange={handleInputChange}
                placeholder="Composition"
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                name="dosage"
                value={formData.dosage}
                onChange={handleInputChange}
                placeholder="Dosage"
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                name="packing"
                value={formData.packing}
                onChange={handleInputChange}
                placeholder="Packing"
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="file"
                name="image"
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required={!editingProduct}
              />
              <textarea
                name="benefits"
                value={formData.benefits}
                onChange={handleInputChange}
                placeholder="Benefits"
                className="w-full p-2 border rounded"
                rows={5}
                required
              ></textarea>
              <input
                type="text"
                name="target"
                value={formData.target}
                onChange={handleInputChange}
                placeholder="Target"
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="Price"
                className="w-full p-2 border rounded"
                required
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                >
                  Cancel
                </button>
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                  {editingProduct ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProduct;
