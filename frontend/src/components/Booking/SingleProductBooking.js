import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";

import { BACKEND_URL_LINK } from '../../routes/url'

const SingleProductBooking = () => {
  const { id: productId } = useParams(); // Extract product ID from URL
  
  const navigate = useNavigate();

  let userId = sessionStorage.getItem("Id");
  if (!userId) {
    navigate("/Login");
  }

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [user, setUser] = useState({ address: [] }); // Initialize user with an empty address array
  const [selectedAddress, setSelectedAddress] = useState("");
  const [userName, setUserName] = useState(""); // Dummy username, replace with actual username if needed

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL_LINK}/api/v2/getProduct/${productId}`);
        const productData = response.data;

        setProduct(productData);
        setTotalPrice(productData.price); // Set initial total price
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [productId]);

  // Fetch user details including addresses
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL_LINK}/api/v1/getUser/${userId}`);
        setUser(response.data);
        setUserName(response.data.name);

        // Set default selected address if available
        if (response.data.address.length > 0) {
          setSelectedAddress(response.data.address[0]);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [userId]);

  const handleQuantityChange = (delta) => {
    const updatedQuantity = Math.max(1, quantity + delta); // Ensure quantity is at least 1
    setQuantity(updatedQuantity);

    if (product) {
      setTotalPrice(updatedQuantity * product.price); // Update total price
    }
  };

  
  const handlePayment = async (amount) => {
    try {
      const response = await axios.post(`${BACKEND_URL_LINK}/api/v6/createOrder`, {
        amount: amount, // amount in paise
        currency: "INR"
      });
      const order = response.data.order;

      const key = await axios.get(`${BACKEND_URL_LINK}/api/v6/getKey`);
      const rozarkey = key.data.key_id;

      return new Promise((resolve, reject) => {
        const options = {
          key: rozarkey,
          amount: amount,
          currency: 'INR',
          name: 'Acme Corp',
          description: 'Test Transaction',
          order_id: order.id,
          callback_url: `${BACKEND_URL_LINK}/api/v6/paymentVerification`,
          prefill: {
            name: userName,
            email: 'gaurav.kumar@example.com',
            contact: '9999999999'
          },
          theme: {
            color: '#F37254'
          },
          handler: function (response) {
            // Payment successful
            resolve(true);
          },
          modal: {
            ondismiss: function () {
              // Payment popup closed without completing payment
              resolve(false);
            }
          }
        };

        // eslint-disable-next-line no-undef
        if (typeof Razorpay === "undefined") {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.async = true;
          script.onload = () => {
            // eslint-disable-next-line no-undef
            const rzp = new Razorpay(options);
            rzp.open();
          };
          document.body.appendChild(script);
        } else {
          // eslint-disable-next-line no-undef
          const rzp = new Razorpay(options);
          rzp.open();
        }
      });
    } catch (error) {
      console.error("Error creating order:", error);
      return false;
    }
  };

  const handlingProcess = async () => {
    const paymentSuccess = await handlePayment(totalPrice);
    if (paymentSuccess) {
      toast.success("Payment successful!");
      handlePlaceOrder();
    } else {
      toast.error("Payment failed or cancelled. Please try again.");
    }
  }

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error("Please select an address before placing the order.");
      return;
    }

    try {
      const orderData = {
        product: [productId],
        quantity: [quantity],
        address: selectedAddress,
        userName: userName,
        price: totalPrice,
        status: "On The Way", // Set order status
        userId: userId
      };

      const response = await axios.post(`${BACKEND_URL_LINK}/api/v3/addOrder`, orderData);

      if (response.status === 201) {
        toast.success("Order placed successfully!");
        navigate("/order"); // Redirect to home or confirmation page
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order. Please try again.");
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-6 md:p-8">
      <ToastContainer />
      <div className="max-w-5xl mx-auto">
        {/* Product Details */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <div className="flex flex-col md:flex-row items-center">
            <img
              src={product.image[0]}
              alt={product.name}
              className="w-40 h-40 object-cover rounded-lg mb-4 md:mb-0 md:mr-6"
            />
            <div className="text-center md:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">{product.name}</h1>
              <p className="text-gray-700 text-lg mt-2">₹{product.price} each</p>
            </div>
          </div>
          <div className="flex justify-center md:justify-start items-center mt-4">
            <button
              onClick={() => handleQuantityChange(-1)}
              className="px-4 py-2 bg-gray-300 rounded-l hover:bg-gray-400"
            >
              -
            </button>
            <span className="px-6 py-2 bg-white border">{quantity}</span>
            <button
              onClick={() => handleQuantityChange(1)}
              className="px-4 py-2 bg-gray-300 rounded-r hover:bg-gray-400"
            >
              +
            </button>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-4 md:mb-0">
            Total: ₹{totalPrice}
          </h2>
        </div>

        {/* Address Selection */}
        <div className="mt-8 bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Select an Address</h2>
          {user.address.length > 0 ? (
            user.address.map((address, index) => (
              <div key={index} className="mb-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="address"
                    value={address}
                    checked={selectedAddress === address}
                    onChange={() => setSelectedAddress(address)}
                    className="mr-2"
                  />
                  <span>{address}</span>
                </label>
              </div>
            ))
          ) : (
            <p>No addresses available. Please add one in your profile.</p>
          )}
          <button 
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 mb-4" 
            onClick={() => navigate("/Profile")}
          >
            Add Address
          </button>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col md:flex-row items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800 mb-4 md:mb-0">
            Total: ₹{totalPrice}
          </h2>
          <div className="flex space-x-4">
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              onClick={() => navigate(-1)}
            >
              Back
            </button>
            <button
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              onClick={handlingProcess}
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProductBooking;
