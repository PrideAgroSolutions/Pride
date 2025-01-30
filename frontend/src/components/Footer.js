import React from "react";
import logo from "../assets/logo.png"; // Replace with the path to your logo

const Footer = () => {
  return (
    <footer className="bg-[#002b40] text-white py-10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between">
          {/* Logo and Divider */}
          <div className="flex flex-col items-center md:items-start">
            <img src={logo} alt="Pridealgro Solutions Logo" className="w-32 mb-4" />
            <hr className="w-full border-gray-600" />
          </div>

          {/* Links Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6 md:mt-0">
            <div>
              <h3 className="font-bold text-lg mb-4">Agriculture</h3>
              <ul className="space-y-2">
                <li className="hover:underline cursor-pointer"><a href="/products">Products</a></li>
                <li className="hover:underline cursor-pointer"><a href="/results">Results</a></li>
                <li className="hover:underline cursor-pointer"><a href="/about#Experts">Our Experts</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">About Us</h3>
              <ul className="space-y-2">
                <li className="hover:underline cursor-pointer"><a href="/about">Our Story</a></li>
                <li className="hover:underline cursor-pointer"><a href="/contact">Contact Us</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-600 mt-8 pt-4 flex flex-col md:flex-row justify-between items-center text-sm">
          <p className="mb-4 md:mb-0">©2024 PridealgroSolutions. All rights reserved.</p>
          <div className="flex space-x-4">
            <a href="#" className="hover:underline">Accessibility Statement</a>
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="https://prideagrosolutions.com/" className="hover:underline">pridealgrosolutions.com</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
