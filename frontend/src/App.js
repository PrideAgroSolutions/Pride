import React, { useEffect } from 'react'
import Router from "./routes/Router";

import { authAction } from "./store";
import { useDispatch } from "react-redux";


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
    </div>
  );
}

export default App;