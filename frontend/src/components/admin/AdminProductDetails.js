import React, { useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import { BACKEND_URL_LINK } from '../../routes/url'

const ProductDetails = () => {
  const { id } = useParams(); // Get the product ID from the URL
  const navigate = useNavigate();

  const [product, setProduct] = useState(null); // Product data
  const [selectedImage, setSelectedImage] = useState(""); // Selected image
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch product details on component mount
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL_LINK}/api/v2/getProduct/${id}`);
        const productData = response.data;

        setProduct(productData);
        setSelectedImage(productData.image[0]); // Default to the first image
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to fetch product details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleImageClick = (img) => {
    setSelectedImage(img);
  };

  const handleGoBack = () => {
    navigate(-1); // Navigate to the previous page
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Product not found.</div>;
  }

  return (
    <div className="flex flex-col lg:flex-row bg-gray-100 p-6 w-full max-w-7xl mx-auto">
      <ToastContainer />
      <FaArrowLeft
        onClick={handleGoBack}
        className="text-gray-600 text-xl mr-2 hover:text-gray-800 cursor-pointer"
      />
      {/* Left Section - Product Image and Gallery */}
      <div className="flex relative flex-col items-center lg:w-1/2">
        <div className="absolute left-0 mt-4">
          {/* Small gallery images */}
          {product.image?.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Gallery ${index}`}
              onClick={() => handleImageClick(img)}
              className={`w-16 h-16 object-cover my-4 rounded-lg border-[3px] cursor-pointer ${
                selectedImage === img ? "border-blue-500" : "border-gray-300"
              }`}
            />
          ))}
        </div>
        <img
          src={selectedImage}
          alt={product.name}
          className="w-96 max-w-md rounded-lg"
        />
      </div>

      {/* Right Section - Product Details */}
      <div className="lg:w-1/2 lg:pl-8 text-left">
        <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
        <div className="mt-6 flex">
          <h3 className="text-lg font-bold text-gray-800">Composition:</h3>
          <ol className="flex text-gray-700">
            {product.composition?.map((item, index) => (
              <li className="ml-4" key={index}>
                {item + (index < product.composition.length - 1 ? "," : "")}
              </li>
            ))}
          </ol>
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-bold text-gray-800">Benefits</h3>
          <p className="mt-2 text-gray-700">{product.benefits}</p>
        </div>
        <div className="mt-6 flex">
          <h3 className="text-lg font-bold text-gray-800">Dosage:</h3>
          <p className="ml-4 text-gray-700">{product.dosage}</p>
        </div>
        <div className="mt-6 flex">
          <h3 className="text-lg font-bold text-gray-800">Packing:</h3>
          <p className="ml-4 text-gray-700">{product.packing}</p>
        </div>
        <div className="mt-6 flex">
          <h3 className="text-lg font-bold text-gray-800">Target Crops:</h3>
          <ol className="flex m-1 text-gray-700">{product.target?.join(", ")}</ol>
        </div>
        <div className="mt-4 flex gap-6">
          <span className="text-green-600 font-bold">10% off</span>
          <h2 className="text-xl text-gray-500 line-through">₹{product.price + 200}</h2>
          <h2 className="text-2xl font-bold text-gray-800">₹{product.price}</h2>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
