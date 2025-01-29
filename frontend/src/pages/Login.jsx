import React, { useContext  , useEffect, useState}  from "react";
import { useForm } from "react-hook-form";
import Oauth from "../component/Oauth";
import { Eye, Lock, User , EyeOff } from "lucide-react";
import { assets } from "../assets/assets";
import {AppContent} from "../context/AppContext.jsx"
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
  
const Login = () => {


  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);


  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const { setIsLoggedIn , getUserData ,  isLoggedIn , UserData }= useContext(AppContent)

    const navigate  = useNavigate()

  //Use to Print the Onsubmit form Data
  const onSubmit = async(data) => {
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.post("http://localhost:3000/api/auth/login",data);

      if (response.data.sucess) {
        toast.success(response.data.message || "Login Sucessfully");
        setIsLoggedIn(true)
        getUserData()
        navigate("/");
      } else {
        toast.error(response.data.message || "Login failed.");
      }

      // Reset the form fields
      reset();
    } catch (error) {
      // Optionally, display an error message to the user
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="background min-h-screen max-h-screen overflow-hidden">
      <a href="/">
        <img src={assets.logo} alt="Logo" className="p-3" />
      </a>
    
    <div className="flex w-full max-w-screen justify-evenly flex-col md:flex-row items-center min-h-[80vh] md:min-h-screen overflow-hidden">
      {/* Login Form Section */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 md:p-10 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Login</h1>
        <p className="text-gray-600 mb-6">Access your account below</p>
  
        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          {/* Username Field */}
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email
            </label>
            <div className="flex items-center bg-gray-50 border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
              <div className="px-3">
                <User className="text-gray-500" />
              </div>
              <input
                id="Email"
                type="email"
                placeholder="Email"
                {...register("email", {
                  required: { value: true, message: "This field is required" },
                })}
                className="flex-1 py-2 px-3 outline-none bg-transparent text-gray-800 placeholder-gray-400"
              />
            </div>
            {errors.email && (
              <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>
  
          {/* Password Field */}
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <div className="flex items-center bg-gray-50 border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
              <div className="px-3">
                <Lock className="text-gray-500" />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                {...register("password", {
                  required: true,
                  maxLength: {
                    value: 20,
                    message: "Max length for Password is 20",
                  },
                  minLength: {
                    value: 8,
                    message: "Minimum length for Password is 8",
                  },
                })}
                className="flex-1 py-2 px-3 outline-none bg-transparent text-gray-800 placeholder-gray-400"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="px-3 focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="text-gray-500" />
                ) : (
                  <Eye className="text-gray-500" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-2 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          <div className="flex justify-between">
              <a href="/forgetpassword" className="text-red-600 hover:underline">
                forget password?
              </a>
              <a href="/signup " className="hover:underline">
                Create Account
              </a>
          </div>
          </div>

  
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg shadow-lg hover:from-blue-600 hover:to-cyan-600 transition-all text-lg font-semibold"
          >
            Submit
          </button>
        </form>
      </div>
  
      {/* Vertical Divider */}
      <div className="hidden md:block border-l-2 border-gray-400 h-[70vh] mx-4"></div>
  
      {/* OAuth Section */}
      <Oauth />
    </div>
  </div>
  
  
  
);
};

export default Login;
