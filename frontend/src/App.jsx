import React from "react";
import { createBrowserRouter , RouterProvider } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home"
import EmailVerify from "./pages/EmailVerify"
import ResetPassword from "./pages/ResetPassword"
import { ToastContainer } from "react-toastify";
import AuthVerifyPassword from "./pages/authVerifyPassword"
import "react-toastify/dist/ReactToastify.css";

const App = () =>{

  const router = createBrowserRouter(
    [
    {
      path:"login",
      element:<Login/>
    },
    {
      path:"signup",
      element:<SignUp/>
    },
    {
      path:"verifyuser",
      element:<EmailVerify/>
    },
    { 
      path:"forgetpassword",
      element:<ResetPassword/>
    },
    {
      path:"/",
      element:<Home/>
    },
    {
      path:"auth-forget-password",
      element: <AuthVerifyPassword/>
}
    

  ])
  return (
    <>
    <RouterProvider router={router}>

    </RouterProvider>
      <ToastContainer/>
    </>
  )
}

export default App