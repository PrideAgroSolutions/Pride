import React, { useEffect } from 'react'
import Router from "./routes/Router";
import Footer from "./components/Footer"

import { authAction } from "./store";
import { useDispatch } from "react-redux";

import Navbar from './components/Navbar';


function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    if (sessionStorage.getItem("Id") || sessionStorage.getItem('AdminId')) {
      dispatch(authAction.login());
    }
  })


  return (
    <div className="text-center">
        <Router />
        <Footer />
    </div>
  );
}

export default App;