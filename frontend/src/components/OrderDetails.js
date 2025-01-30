import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import axios from "axios";

import { BACKEND_URL_LINK } from '../routes/url'

const OrderDetails = () => {
  const navigate = useNavigate();
  const { id: orderId } = useParams(); // Extract orderId from the URL
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL_LINK}/api/v3/getSpecificOrder/${orderId}`);
        setOrder(response.data);
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, []);

  

  if (loading) {
    return <li>Loading order details...</li>;
  }

  if (!order) {
    return <li>Order not found.</li>;
  }

  return (
    <div className="w-[90%] mx-auto mt-10">
      <FaArrowLeft
                onClick={()=>navigate(-1)}
                className="text-gray-600 text-xl mr-2 hover:text-gray-800 cursor-pointer"
              />
      <h1 className="text-2xl font-bold mb-4 text-center">Order Details</h1>
      <h2 className="text-xl font-bold text-left mb-4 text-center sm:text-left">
        Order Placed By: {order.userId.name}
      </h2>
      <div className="flex flex-col sm:flex-row justify-between w-full sm:w-[70%] mx-auto mb-8 gap-4">
        <ul className="list-disc m-auto text-left flex-1">
          <li className="text-lg mb-2 sm:mb-4">Total Price: ₹{order.price}</li>
          <li className="text-lg mb-2 sm:mb-4">
            Total Quantity: {order.quantity.reduce((acc, qty) => acc + qty, 0)}
          </li>
        </ul>
        <ul className="list-disc m-auto text-left flex-1">
          <li className="text-lg mb-2 sm:mb-4">Order Status: {order.status}</li>
          <li className="text-lg mb-2 sm:mb-4">Delivery Address: {order.address}</li>
        </ul>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {order.products.map((product, index) => (
          <div key={product._id} className="bg-white rounded p-4">
            <img
              src={product.image[0]}
              alt={product.name}
              className="w-full h-40 object-cover mb-4"
            />
            <h2 className="text-xl font-bold mb-2">{product.name}</h2>
            <p className="text-lg font-semibold mb-2">₹{product.price}</p>
            <p className="text-sm text-gray-600">Quantity: {order.quantity[index]}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderDetails;
