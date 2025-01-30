import React from "react";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const navigateToProductDetails = () => {
    navigate(`/ProductDetails/${product._id}`); // Navigate to the product details page
  };

  return (
    <div
      onClick={navigateToProductDetails}
      className="flex flex-col items-start w-[95%] mx-auto bg-white border border-gray-300 rounded-lg p-6 cursor-pointer duration-300 text-left"
    >
      <h3 className="text-xl font-bold text-gray-800 mb-3 text-left w-full">
        {product.name}
      </h3>
      {/* Product Image */}
      <div className="w-full flex justify-center mb-4">
        <img
          src={product.image[0]} // Assuming the first image in the array
          alt={product.name}
          className="w-[80%] h-48 object-cover rounded-lg"
        />
      </div>

      {/* Product Name */}

      {/* Composition */}
      <p className="text-gray-700 text-sm mb-2">
        <strong className="text-gray-800">Composition:</strong> {product.composition.join(", ")}
      </p>

      {/* Dosage */}
      <p className="text-gray-700 text-sm mb-2">
        <strong className="text-gray-800">Dosage:</strong> {product.dosage}
      </p>

      {/* Target Crops */}
      <p className="text-gray-700 text-sm mb-2">
        <strong className="text-gray-800">Target Crops:</strong> {product.target.join(", ")}
      </p>

      {/* Price Section */}
      <div className="mt-4 text-center">
        <h2 className="text-2xl font-bold text-green-600">₹{product.price}</h2>
      </div>
    </div>
  );
};

export default ProductCard;
