import React, { useState } from "react";

import { useNavigate, Link } from "react-router-dom"

import { GoogleLogin } from '@react-oauth/google';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

import axios from "axios";

import { BACKEND_URL_LINK } from '../../routes/url'

const SignUpPage = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        age: "",
        mobile: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({
        name: "",
        email: "",
        age: "",
        mobile: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const validate = () => {
        let isValid = true;
        const newErrors = { ...errors };

        // Name validation
        if (!formData.name) {
            newErrors.name = "Name is required";
            isValid = false;
        } else {
            newErrors.name = "";
        }

        // Email validation
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!formData.email || !emailRegex.test(formData.email)) {
            newErrors.email = "Please enter a valid email";
            isValid = false;
        } else {
            newErrors.email = "";
        }

        // Age validation
        if (!formData.age || formData.age < 18) {
            newErrors.age = "You must be 18 or older";
            isValid = false;
        } else {
            newErrors.age = "";
        }

        // Mobile validation
        const mobileRegex = /^[0-9]{10}$/;
        if (!formData.mobile || !mobileRegex.test(formData.mobile)) {
            newErrors.mobile = "Please enter a valid 10-digit mobile number";
            isValid = false;
        } else {
            newErrors.mobile = "";
        }

        // Password validation
        if (!formData.password || formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
            isValid = false;
        } else {
            newErrors.password = "";
        }

        // Confirm Password validation
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
            isValid = false;
        } else {
            newErrors.confirmPassword = "";
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            try {
                const response = await axios.post(`${BACKEND_URL_LINK}/api/v1/createUser`, formData);
                sessionStorage.setItem("Id", response.data.user._id);
                navigate("/products"); // Redirect to another page after signup
            } catch (error) {
                alert(error.response.data.error || "Something went wrong");
            }
        } else {
            alert("Please fix the errors before submitting");
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {

            const decoded = jwtDecode(credentialResponse.credential);
            const { name, email } = decoded;

            const response = await axios.post(`${BACKEND_URL_LINK}/api/v1/createUserWithGoogle`, {
                name,
                email,
            });

            sessionStorage.setItem("Id", response.data.user._id);
            navigate("/products"); // Redirect to another page after signup
        } catch (error) {
            alert(error.response.data.error || "Google Signup failed");
            console.log(error.response.data.error);

        }
    };

    return (
        <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="bg-gradient-to-r from-gray-100 my-16  via-gray-200 to-gray-300 p-6 rounded-lg shadow-md w-full max-w-4xl">
                <h2 className="text-center text-2xl font-bold mb-4">Sign Up</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium mb-1">
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your name"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                        </div>

                        <div>
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                        </div>

                        <div>
                            <label htmlFor="age" className="block text-sm font-medium mb-1">
                                Age
                            </label>
                            <input
                                type="number"
                                id="age"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                placeholder="Enter your age"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}
                        </div>

                        <div>
                            <label htmlFor="mobile" className="block text-sm font-medium mb-1">
                                Mobile No.
                            </label>
                            <input
                                type="text"
                                id="mobile"
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleChange}
                                placeholder="Enter your mobile number"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            {errors.mobile && <p className="text-red-500 text-sm">{errors.mobile}</p>}
                        </div>

                        <div>
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm your password"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600"
                    >
                        Sign Up
                    </button>

                </form>

                <div className="flex-d my-4 justify- text-center">
                    <div className="flex w-full justify-center my-4">
                        <GoogleOAuthProvider clientId="868841687218-21ugghgsrv0kck0frcu5oh28vi8ik0pb.apps.googleusercontent.com">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => console.error("Google SignUp Failed")}
                            />
                        </GoogleOAuthProvider>
                    </div>

                    <span className="text-sm">Already have an account?  </span>
                    <Link
                        to="/login"
                        className="text-sm text-blue-500 hover:underline"
                    >
                        Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;
