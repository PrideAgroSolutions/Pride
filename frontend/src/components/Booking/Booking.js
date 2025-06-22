import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";

import { BACKEND_URL_LINK } from '../../routes/url'

const Booking = () => {
  const navigate = useNavigate();
  
  let userId = sessionStorage.getItem("Id");
  if(userId === "") {
    navigate("/Login");
  }

  const [cart, setCart] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [user, setUser] = useState({ address: [] }); // Initialize user with an empty address array
  const [selectedAddress, setSelectedAddress] = useState("");
  const [userName, setUserName] = useState(""); // Dummy username, replace it with the actual username if needed

  // Fetch cart details
  useEffect(() => {
    const fetchCart = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL_LINK}/api/v1/getCart/${userId}`);
            const cartData = response.data;

            // Populate cart with product details
            const updatedProducts = cartData.map((item) => ({
                ...item,
                quantity: item.quantity || 1, // Default quantity to 1 if not provided
            }));

            setCart(updatedProducts);

            // Calculate total price
            const total = updatedProducts.reduce((acc, item) => acc + item.price * item.quantity, 0);
            setTotalPrice(total);
        } catch (error) {
            console.error("Error fetching cart:", error);
        }
    };

    fetchCart();
  }, [userId]);

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

  const handleQuantityChange = (productId, delta) => {
    const updatedProducts = cart.map((item) =>
      item._id === productId
        ? { ...item, quantity: Math.max(1, item.quantity + delta) } // Ensure quantity is at least 1
        : item
    );

    setCart(updatedProducts);

    // Recalculate total price
    const total = updatedProducts.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotalPrice(total);
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
      const productIds = cart.map(product => product._id);
      const quantities = cart.map(product => product.quantity);
      const orderData = {
        product: productIds,
        quantity: quantities,
        address: selectedAddress,
        userName: userName,
        price: totalPrice,
        status: "On The Way", // Set order status
        userId: userId
      };

      const response = await axios.post(`${BACKEND_URL_LINK}/api/v3/addOrder`, orderData);

      if (response.status === 201) {
        // toast.success("Order placed successfully!");
        navigate("/order"); // Redirect to the home page or confirmation page
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order. Please try again.");
    }
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
          <h1 className="text-3xl font-bold text-gray-800">Booking Summary</h1>
          <h2 className="text-xl font-bold text-gray-800">
            Total: ₹{totalPrice}
          </h2>
        </div>

        {/* Cart Products */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cart.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between"
            >
              <img
                src={product.image[0]}
                alt={product.name}
                className="w-full h-40 object-cover rounded-lg"
              />
              <h2 className="text-xl font-bold text-gray-800 mt-4">
                {product.name}
              </h2>
              <p className="text-gray-700">₹{product.price} each</p>
              <div className="flex items-center mt-4">
                <button
                  onClick={() => handleQuantityChange(product._id, -1)}
                  className="px-2 py-1 bg-gray-300 rounded-l hover:bg-gray-400"
                >
                  -
                </button>
                <span className="px-4 py-2 bg-white border">{product.quantity}</span>
                <button
                  onClick={() => handleQuantityChange(product._id, 1)}
                  className="px-2 py-1 bg-gray-300 rounded-r hover:bg-gray-400"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Address Selection */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
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
          <button className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 mb-4" onClick={()=>navigate("/Profile")}>Add Address</button>
        </div>

        <div className="mt-6 flex justify-between">
        <h2 className="text-xl font-bold text-gray-800">
            Total: ₹{totalPrice}
          </h2>
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
  );
};

export default Booking;
