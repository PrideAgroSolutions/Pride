import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

import { useNavigate } from "react-router-dom";
import axios from "axios";

import { BACKEND_URL_LINK } from '../../routes/url'

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: "", password: "" });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get(`${BACKEND_URL_LINK}/api/v1/login`, {
                params: { email: formData.email, password: formData.password },
            });

            if (response.status === 200) {
                sessionStorage.setItem("Id", response.data.user._id);
                navigate("/products");
            }
        } catch (error) {
            console.error("Login failed:", error.response.data.error);
            alert(error.response.data.error);
        }
    };

    const handleGoogleLogin = async (credentialResponse) => {
        const decoded = jwtDecode(credentialResponse.credential);
        const email = decoded.email;

        try {
            const response = await axios.get(`${BACKEND_URL_LINK}/api/v1/googleLogin`, {
                params: { email },
            });

            if (response.status === 200) {
                sessionStorage.setItem("Id", response.data.user._id);
                navigate("/products");
            }
        } catch (error) {
            console.error("Google login failed:", error.response.data.error);
            alert(error.response.data.error);
        }
    };

    return (
        <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="bg-gradient-to-r my-24 from-gray-100 via-gray-200 to-gray-300 p-6 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-center text-2xl font-bold mb-4">User Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium mb-1">
                            Email ID
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full mb-6 bg-green-500 text-white py-2 rounded-md hover:bg-green-600"
                    >
                        Login
                    </button>
                </form>


                <div className="flex-d my-4 justify- text-center">
                    <div className="flex w-full justify-center my-4">
                        <GoogleOAuthProvider clientId="868841687218-21ugghgsrv0kck0frcu5oh28vi8ik0pb.apps.googleusercontent.com">
                            <GoogleLogin
                                onSuccess={handleGoogleLogin}
                                onError={() => console.error("Google Login Failed")}
                            />
                        </GoogleOAuthProvider>
                    </div>

                    <span className="text-sm">I don't have an account! </span>
                    <a
                        href="/Signup"
                        className="text-sm text-blue-500 hover:underline"
                    >
                        Sign Up
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Login;
