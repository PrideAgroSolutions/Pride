
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL_LINK } from '../../routes/url'

const AdminHomePage = () => {
  const navigate = useNavigate();

  let AdminId = sessionStorage.getItem("AdminId");
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!AdminId) {
      navigate("/admin/Login");
      return;
    }
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL_LINK}/api/v4/allInfo`);
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching admin data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-lg">Loading...</div>;
  }

  return (
    <div className="p-6 font-sans">
      {/* Row 1: Total Sell and Total Orders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="p-4 border border-gray-300 rounded-lg bg-gray-100 text-center">
          <h2 className="text-xl font-semibold">Total Sell</h2>
          <p className="text-2xl text-green-600 font-bold">₹{data.totalSell.toFixed(2)}</p>
        </div>
        <div className="p-4 border border-gray-300 rounded-lg bg-gray-100 text-center">
          <h2 className="text-xl font-semibold">Total Orders</h2>
          <p className="text-2xl text-blue-600 font-bold">{data.totalOrders}</p>
        </div>
      </div>

      {/* Row 2: Product Statistics Grid */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Product Statistics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.productStats.map((product, index) => (
            <div key={index} className="p-4 border border-gray-300 rounded-lg bg-gray-100">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
              <p>Total Orders: {product.totalOrders}</p>
              <p>Total Sell: ₹{product.totalSell.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage;
