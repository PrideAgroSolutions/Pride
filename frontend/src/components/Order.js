import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

import { BACKEND_URL_LINK } from '../routes/url'

const OrderList = () => {
  const navigate = useNavigate();

  let userId = sessionStorage.getItem("Id");

  const [orders, setOrders] = useState([]);

  // Fetch all orders for the user
  useEffect(() => {
    if (!userId) {
      navigate("/Login");
      return;
    }
    const fetchUserOrders = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL_LINK}/api/v3/getUserOrder/${userId}`);
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching user orders:", error);
      }
    };

    fetchUserOrders();
  }, [userId]);

  const handleCancelOrder = async (orderId) => {
    try {
      let confirmStatus = window.confirm("Are you sure you want to cancel the order?");
      if (!confirmStatus) {
        return;
      }
      const response = await axios.put(`${BACKEND_URL_LINK}/api/v3/cancelOrder`, { id: orderId });
      toast.success(response.data.message);

      // Update the order status locally
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: "Cancelled" } : order
        )
      );
    } catch (error) {
      console.error("Error canceling order:", error);
      toast.error("Failed to cancel order.");
    }
  };

  if (orders.length === 0) {
    return (
      <div className="bg-gray-100 min-h-screen p-6">
        <ToastContainer />
        <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg ">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">No Orders Found</h1>
          <p className="text-lg text-gray-600">You have no orders yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-6">
      <ToastContainer />
      <div className="max-w-7xl mx-auto bg-white p-4 md:p-6 rounded-lg">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Your Orders</h1>

        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white p-4 md:p-6 rounded-lg border border-gray-200"
            >
              <h2 className="text-lg md:text-xl font-semibold pl-5">
                <strong>Status:</strong> {order.status}
              </h2>
              <div className="flex flex-col md:flex-row justify-between gap-4 w-full">
                <div className="text-gray-600 text-left">
                  <h3 className="text-lg md:text-xl font-medium">Details :</h3>
                  <p className="text-base md:text-lg pl-5">
                    <strong>Total Price:</strong> ₹{order.price}
                  </p>
                  <p className="text-base md:text-lg pl-5">
                    <strong>Order Date:</strong> {new Date(order.timestamp).toLocaleString()}
                  </p>
                  <p className="text-base md:text-lg pl-5">
                    <strong>Shipping Address:</strong> {order.address}
                  </p>
                </div>

                {/* Product List */}
                <div className="text-gray-600 text-left">
                  <h3 className="text-lg md:text-xl font-medium">Products:</h3>
                  <div className="list-disc pl-5 space-y-2">
                    {order.products.map((product, index) => (
                      <p key={product._id} className="text-gray-600">
                        <strong>{product.name}</strong> - ₹{product.price} x {order.quantity[index]}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 text-center space-y-4 md:space-y-0 md:space-x-4">
                <h3 className="text-lg md:text-xl mb-2 md:mb-0 font-medium">
                  Total Quantity : {order.quantity.reduce((acc, qty) => acc + qty, 0)}
                </h3>

                <a
                  href={`/Order/${order._id}`}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition block md:inline-block"
                >
                  View Order Details
                </a>

                {order.status === "On The Way" && (
                  <button
                    onClick={() => handleCancelOrder(order._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition block md:inline-block"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderList;
