import React, { useState, useEffect } from "react";

import { authAction } from "../store";
import { useDispatch } from "react-redux";

import axios from "axios";
import ProductCard from "./ProductCard";
import BannerSlider from "./BannerSlider";

import { BACKEND_URL_LINK } from '../routes/url'

const Product = () => {
  
  const dispatch = useDispatch();
  useEffect(() => {
    if(sessionStorage.getItem("Id")) {
      dispatch(authAction.login());
    }
  })
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL_LINK}/api/v2/getAllProduct`); // Fetch data from the backend
        setProducts(response.data); // Set the fetched data to the state
        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-semibold">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-semibold text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Banner Slider */}
      <div className="py-4">
        <BannerSlider />
      </div>

      {/* Product List */}
      <div className="flex flex-col items-center gap-8 py-8 px-4">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-4">
          Our Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Product;
