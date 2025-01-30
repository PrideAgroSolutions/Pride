import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { BACKEND_URL_LINK } from '../routes/url'

const Cart = () => {
  const navigate = useNavigate();
  let userId = sessionStorage.getItem("Id");

  // Replace with the actual user ID
  const [cart, setCart] = useState([]); // Cart data (array of products)
  const [totalPrice, setTotalPrice] = useState(0); // Total price

  // Fetch cart details
  useEffect(() => {
    if (!userId) {
      navigate("/Login");
      return;
    }

    const fetchCart = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL_LINK}/api/v1/getCart/${userId}`);
        const cartData = response.data;
        setCart(cartData);

        // Calculate total price
        const total = cartData.reduce((acc, item) => acc + item.price, 0);
        setTotalPrice(total);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    fetchCart();
  }, []);

  const handleRemoveItem = async (productId) => {
    const confirmRemove = window.confirm("Are you sure you want to remove this item?");
    if (!confirmRemove) return; // If the user cancels, do not proceed with the removal

    try {
      const response = await axios.put(`${BACKEND_URL_LINK}/api/v1/removeItem`, {
        userId,
        productId,
      });

      if (response.status === 200) {
        setCart(response.data); // Update cart with the latest data

        // Recalculate total price
        const total = response.data.reduce((acc, item) => acc + item.price, 0);
        setTotalPrice(total);

        toast("Item removed from cart!"); // Show alert after item is removed
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const handleCardClick = (productId) => {
    navigate(`/productdetails/${productId}`); // Navigate to the product details page
  };

  if (!cart) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <ToastContainer />
      <div className="max-w-7xl mx-auto">
        {/* Total Price */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Your Cart</h1>
          <h2 className="text-xl font-bold text-gray-800">
            Total: ₹{totalPrice}
          </h2>
        </div>

        {/* Cart Products */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cart.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-lg   p-4 flex flex-col justify-between cursor-pointer"
              onClick={() => handleCardClick(product._id)} // Navigate on card click
            >
              <img
                src={product.image[0]}
                alt={product.name}
                className="w-full h-40 object-cover rounded-lg"
              />
              <h2 className="text-xl font-bold text-gray-800 mt-4">
                {product.name}
              </h2>
              <p className="text-gray-700">₹{product.price}</p>

              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent navigation
                  handleRemoveItem(product._id);
                }}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Remove Item
              </button>
            </div>
          ))}
        </div>
        <div className="mt-6 flex space-x-4">
          {totalPrice !== 0 && (
            <button
              className="mt-4 w-[90%] m-auto px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
              onClick={() => navigate("/Booking")}
            >
              Buy All Now: <strong>{totalPrice}</strong>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
