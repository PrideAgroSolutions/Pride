import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { authAction } from '../store';

const AdminNavbar = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.isLoggedIn);

  const handleLogout = () => {
    let confirmLogout = window.confirm("Are you Sure to Logout!");
    if (!confirmLogout) {
      return;
    }
    dispatch(authAction.logout());
    sessionStorage.removeItem("AdminId");
    sessionStorage.removeItem("role");
    window.location.reload();
  };

  const [isMenuOpen, setIsMenuOpen] = useState(true);

  return (
    <nav className="select-none sticky top-0 z-10 bg-gradient-to-r from-yellow-500 via-brown-500 to-green-700 py-4 px-6 md:px-8 ">
      <div className="container flex justify-between items-center">
        <div className='flex items-center'>
          <div className="text-yellow-700 text-2xl font-bold cursor-pointer">
            <img onClick={() => window.location.reload()} alt='logo' className='w-20' src={logo} />
          </div>
          <button
            className="absolute right-1 mr-4 md:hidden text-white focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        <ul className={`lg:hidden md:hidden absolute top-16 gap-16 px-8 py-2 left-0 w-full bg-gradient-to-r from-yellow-500 via-brown-500 to-green-700 text-white md:static md:flex md:space-x-6 md:w-auto transition-all duration-900 ${isMenuOpen ? 'hidden' : 'block'} md:gap-6`}>
          <li className="hover:text-yellow-400 cursor-pointer p-4 md:p-0">
            <Link to="/admin">Home</Link>
          </li>
          <li className="hover:text-yellow-400 cursor-pointer p-4 md:p-0">
            <Link to="/admin/order">Orders</Link>
          </li>
          <li className="hover:text-yellow-400 cursor-pointer p-4 md:p-0">
            <Link to="/admin/product">Products</Link>
          </li>
          <li className="hover:text-yellow-400 cursor-pointer p-4 md:p-0">
            <Link to="/admin/results/">Result</Link>
          </li>
          <li className="hover:text-yellow-400 cursor-pointer p-4 md:p-0">
            <Link to="/admin/create">CreateAdmin</Link>
          </li>
        </ul>

        <div>
          <ul className="hidden md:flex gap-16 bg-gradient-to-r from-[#ada417] via-[#cfac1e] to-[#59902c] px-8 py-2 left-0 w-full text-white">
            <li className="hover:text-gray-300 cursor-pointer p-4 md:p-0">
              <Link to="/admin">Home</Link>
            </li>
            <li className="hover:text-yellow-400 cursor-pointer p-4 md:p-0">
              <Link to="/admin/order">Orders</Link>
            </li>
            <li className="hover:text-gray-300 cursor-pointer p-4 md:p-0">
              <Link to="/admin/product">Products</Link>
            </li>
            <li className="hover:text-gray-300 cursor-pointer p-4 md:p-0">
              <Link to="/admin/results/">Result</Link>
            </li>
            <li className="hover:text-gray-300 cursor-pointer p-4 md:p-0">
              <Link to="/admin/create">CreateAdmin</Link>
            </li>
          </ul>
        </div>

        {!isLoggedIn && (
          <button className='p-2 bg-orange-400 mr-10 rounded-md'>
            <Link to="/admin/Login">Login</Link>
          </button>
        )}
        {isLoggedIn && (
          <button onClick={handleLogout} className='p-2 bg-red-400 mr-10 rounded-md'>Logout</button>
        )}
      </div>
    </nav>
  );
};

export default AdminNavbar;
