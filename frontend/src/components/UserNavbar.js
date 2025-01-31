import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import { VscAccount } from "react-icons/vsc";
import { FaCartShopping } from "react-icons/fa6";
import { useSelector, useDispatch } from 'react-redux';
import { authAction } from '../store';

const Navbar = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const handleLogout = () => {
    let confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) {
      return;
    }
    dispatch(authAction.logout());
    sessionStorage.removeItem("Id");
  };

  return (
    <nav className="select-none sticky top-0 z-10 bg-gradient-to-r from-yellow-500 via-brown-500 to-green-700 py-4 px-6 md:px-8">
      <div className="container flex justify-between items-center">
        <div className='flex items-center'>
          <div className="text-yellow-700 text-2xl font-bold cursor-pointer">
            <img onClick={() => window.location.reload()} className='w-20' src={logo} alt="Logo" />
          </div>
          <button
            className="absolute right-1 mr-2 md:hidden text-white focus:outline-none"
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

        <ul className={`lg:hidden md:hidden absolute top-16 gap-16 px-8 py-2 left-0 w-full bg-gradient-to-r from-yellow-500 via-brown-500 to-green-700 text-white transition-all duration-900 ${isMenuOpen ? 'hidden' : 'block'} md:gap-6`}>
          <li className="hover:text-yellow-400 cursor-pointer p-4 md:p-0">
            <Link to="/">Home</Link>
          </li>
          <li className="hover:text-yellow-400 cursor-pointer p-4 md:p-0">
            <Link to="/products">Products</Link>
          </li>
          <li className="hover:text-yellow-400 cursor-pointer p-4 md:p-0">
            <Link to="/results">Our Result</Link>
          </li>
          <li className="hover:text-yellow-400 cursor-pointer p-4 md:p-0">
            <Link to="/about">About</Link>
          </li>
          <li className="hover:text-yellow-400 cursor-pointer p-4 md:p-0">
            <Link to="/contact">Contact Us</Link>
          </li>
        </ul>

        <div>
          <ul className="hidden md:flex gap-16 bg-gradient-to-r from-[#ada417] via-[#cfac1e] to-[#59902c] px-8 py-2 text-white">
            <li className="hover:text-gray-300 cursor-pointer p-4 md:p-0">
              <Link to="/">Home</Link>
            </li>
            <li className="hover:text-gray-300 cursor-pointer p-4 md:p-0">
              <Link to="/products">Products</Link>
            </li>
            <li className="hover:text-gray-300 cursor-pointer p-4 md:p-0">
              <Link to="/results">Our Result</Link>
            </li>
            <li className="hover:text-gray-300 cursor-pointer p-4 md:p-0">
              <Link to="/about">About</Link>
            </li>
            <li className="hover:text-gray-300 cursor-pointer p-4 md:p-0">
              <Link to="/contact">Contact Us</Link>
            </li>
          </ul>
        </div>

        <div className='flex gap-6 text-white justify-center mr-6'>
          <div className="flex relative p-2 group">
            <VscAccount size={25} className='hover:text-gray-300' />
            <div className="absolute right-4 top-6 w-40 bg-gradient-to-r from-yellow-600 via-brown-500 to-green-600 text-white rounded-md hidden group-hover:block">
              <ul className="space-y-2 p-2">
                <li className="hover:text-gray-200 border-b cursor-pointer">
                  <Link to="/profile">Profile</Link>
                </li>
                <li className="hover:text-gray-200 my-4 cursor-pointer">
                  <Link to="/order">Orders</Link>
                </li>
              </ul>
            </div>
          </div>
          <Link className='mt-2' to='/cart'>
            <FaCartShopping size={25} className='hover:text-gray-300' />
          </Link>
          {!isLoggedIn && (
            <button className='px-2 bg-orange-400 rounded-md'>
              <Link to="/login">Login</Link>
            </button>
          )}
          {isLoggedIn && (
            <button onClick={handleLogout} className='px-2 bg-red-400 rounded-md'>Logout</button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;