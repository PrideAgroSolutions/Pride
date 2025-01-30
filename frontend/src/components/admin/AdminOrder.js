import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BACKEND_URL_LINK } from '../../routes/url'

const AdminOrder = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  
  let AdminId = sessionStorage.getItem("AdminId");

  // Fetch all orders
  useEffect(() => {
    if (!AdminId) {
      navigate("/admin/Login");
      return;
    }
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL_LINK}/api/v4/orders`);
        setOrders(response.data.reverse());
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Handle status update
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const response = await axios.put(`${BACKEND_URL_LINK}/api/v4/orders/${orderId}/status`, {
        status: newStatus,
      });

      toast.success(response.data.message || "Order status updated successfully.");

      // Update the order status locally
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status.");
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-100 min-h-screen p-6 flex items-center justify-center">
        <div className="text-lg font-medium text-gray-600">Loading orders...</div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-gray-100 min-h-screen p-6">
        <ToastContainer />
        <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">No Orders Found</h1>
          <p className="text-lg text-gray-600">No orders are available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-6">
      <ToastContainer />
      <div className="max-w-7xl mx-auto bg-white p-4 md:p-6 rounded-lg">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Admin: All Orders</h1>

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
                  <h3 className="text-lg md:text-xl font-medium">Details:</h3>
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

              {/* Update Status Section */}
              <div className="mt-4 text-center space-y-4 md:space-y-0 md:space-x-4">
                <h3 className="text-lg md:text-xl mb-2 md:mb-0 font-medium">
                  Total Quantity: {order.quantity.reduce((acc, qty) => acc + qty, 0)}
                </h3>

                <Link
                  to={`/Order/${order._id}`}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition block md:inline-block"
                >
                  View Order Details
                </Link>

                <div className="inline-block">
                  <select
                    onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition"
                    defaultValue="Choose Status"
                  >
                    <option value="Choose Status">Choose Status</option>
                    <option value="On The Way">On The Way</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminOrder;
