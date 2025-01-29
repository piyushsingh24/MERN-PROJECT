import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { User, LockKeyhole } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { assets } from "../assets/assets";

const ResetPassword = () => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Step 1: Send OTP to email
  const handleSendOtp = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://mern-project-backend-tdgu.onrender.com/api/auth/forget-password",
        data
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setEmail(data.email);
        setShowOtpForm(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
    setLoading(false);
    reset();
  };

  // Step 2: Verify OTP & Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/verify-forget-password",
        { email, otp, newPassword }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    }
    setLoading(false);
  };

  return (
    <div className="background min-h-screen ">
      <a href="/">
        <img src={assets.logo} alt="Logo" className="p-3" />
      </a>

      <div className="flex w-full max-w-screen justify-center items-center min-h-[80vh]">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 md:p-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {showOtpForm ? "Verify OTP" : "Forgot Password"}
          </h1>
          <p className="text-gray-600 mb-6">
            {showOtpForm
              ? "Enter the OTP sent to your email & reset your password"
              : "Reset your password"}
          </p>

          {!showOtpForm ? (
            // Form to send OTP
            <form onSubmit={handleSubmit(handleSendOtp)} className="w-full">
              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="flex items-center bg-gray-50 border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
                  <div className="px-3">
                    <User className="text-gray-500" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter email"
                    {...register("email", {
                      required: { value: true, message: "Email is required" },
                    })}
                    className="flex-1 py-2 px-3 outline-none bg-transparent text-gray-800 placeholder-gray-400"
                  />
                </div>
                {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition-all text-lg font-semibold flex justify-center items-center"
                disabled={loading}
              >
                {loading ? <span className="loader"></span> : "Send OTP"}
              </button>
            </form>
          ) : (
            // OTP Verification & Password Reset Form
            <form className="w-full" onSubmit={handleResetPassword}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  OTP Code
                </label>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full py-2 px-3 border rounded-lg focus:outline-none"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="flex items-center bg-gray-50 border rounded-lg overflow-hidden">
                  <div className="px-3">
                    <LockKeyhole className="text-gray-500" />
                  </div>
                  <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="flex-1 py-2 px-3 outline-none bg-transparent text-gray-800 placeholder-gray-400"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-green-500 text-white rounded-lg shadow-lg hover:bg-green-600 transition-all text-lg font-semibold flex justify-center items-center"
                disabled={loading}
              >
                {loading ? <span className="loader"></span> : "Reset Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
