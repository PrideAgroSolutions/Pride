import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from '../components/Home'
import Product from '../components/Product'
import About from '../components/About'
import Contact from '../components/Contact'
import Results from '../components/Results'
import ProductDetails from '../components/ProductDetails'

import Profile from '../components/Profile'
import Cart from '../components/Cart'
import Order from '../components/Order'
import OrderDetails from '../components/OrderDetails'

import Booking from '../components/Booking/Booking'
import SingleProductBooking from '../components/Booking/SingleProductBooking'


import Login from '../components/User/Login'
import SignUp from '../components/User/SignUp'


// Admin Routes : 
import AdminHome from '../components/admin/AdminHome'
import AdminLogin from '../components/admin/AdminLogin'

import AdminCreate from '../components/admin/AdminCreate'
import AdminResult from '../components/admin/AdminResult'

import AdminProduct from '../components/admin/AdminProduct'
import AdminProductDetails from '../components/admin/AdminProductDetails'

import AdminOrder from '../components/admin/AdminOrder'

function Router() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home/>} ></Route>
            
            <Route path="/Products" element={<Product/>} ></Route>
            <Route path="/ProductDetails/:id" element={<ProductDetails/>} ></Route> 
            
            <Route path="/About" element={<About/>} ></Route>
            <Route path="/Contact" element={<Contact/>} ></Route> 
            <Route path="/Results" element={<Results/>} ></Route>
            
            <Route path="/Profile" element={<Profile/>} ></Route> 
            <Route path="/Cart" element={<Cart/>} ></Route> 
            <Route path="/Order" element={<Order/>} ></Route> 
            <Route path="/Order/:id" element={<OrderDetails/>} ></Route> 
            
            <Route path="/Login" element={<Login/>} ></Route> 
            <Route path="/SignUp" element={<SignUp/>} ></Route> 

            
            <Route path="/Booking" element={<Booking/>} ></Route> 
            <Route path="/Booking/:id" element={<SingleProductBooking/>} ></Route> 
            
            
            {/* Admin */}
            <Route path="/admin/" element={<AdminHome/>} ></Route> 
            <Route path="/admin/Login" element={<AdminLogin/>} ></Route> 
            
            <Route path="/admin/Create" element={<AdminCreate/>} ></Route> 
            <Route path="/admin/Results" element={<AdminResult/>} ></Route> 

            <Route path="/admin/Product" element={<AdminProduct/>} ></Route> 
            <Route path="/admin/ProductDetails/:id" element={<AdminProductDetails/>} ></Route> 
            
            <Route path="/admin/Order" element={<AdminOrder/>} ></Route>

        </Routes>
    </BrowserRouter>
  )
}

export default Router