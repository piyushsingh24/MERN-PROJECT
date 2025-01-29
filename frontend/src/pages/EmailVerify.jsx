import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContent } from "../context/AppContext";

const EmailVerify = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);

  const {getUserData} = useContext(AppContent)
  const navigate = useNavigate();

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Automatically focus the next box
    if (element.nextSibling && element.value !== "") {
      element.nextSibling.focus();
    }
  };

  const handleKeyDown = (event, index) => {
    if (event.key === "Backspace" && otp[index] === "") {
      // If the current box is empty, move focus to the previous box
      if (event.target.previousSibling) {
        event.target.previousSibling.focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6); // Get the first 6 characters
    if (!/^[0-9]+$/.test(pastedData)) return; // Ensure only numeric values are pasted

    const newOtp = [...otp];
    pastedData.split("").forEach((char, index) => {
      if (index < otp.length) newOtp[index] = char; // Update OTP values
    });

    setOtp(newOtp);

    // Focus the last input box filled
    const lastFilledIndex = pastedData.length - 1;
    if (lastFilledIndex >= 0 && lastFilledIndex < otp.length) {
      const nextInput = document.getElementById(`otp-input-${lastFilledIndex}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const response = await axios.post(
        "https://mern-project-backend-tdgu.onrender.com/api/auth/verify",
        {
          otp: otp.join(""), 
        },
        { withCredentials: true }
      );
  
      if (response.data.success) {
        toast.success(response.data.message || "OTP Verified Successfully!");
        getUserData();
        navigate("/login");
      } else {
        toast.error("OTP Verification Failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="background min-h-screen max-h-screen overflow-hidden">
      <img
        src={assets.logo}
        alt="Logo"
        className="p-3 cursor-pointer"
        onClick={() => navigate("/")}
      />
      <div className="flex w-full max-w-screen justify-evenly flex-col md:flex-row items-center min-h-[80vh] md:min-h-screen overflow-hidden">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 md:p-10 flex flex-col items-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Account Verification</h1>
          <p className="text-gray-600 mb-6">Enter the 6 digit OTP sent to your email</p>

          <form onSubmit={handleSubmit} className="w-full">
            <div className="flex justify-center gap-3 mb-6">
              {otp.map((value, index) => (
                <input
                  key={index}
                  id={`otp-input-${index}`}
                  type="text"
                  maxLength="1"
                  value={value}
                  onChange={(e) => handleChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={handlePaste}
                  onFocus={(e) => e.target.select()}
                  className="w-12 h-12 text-center border border-gray-300 rounded-lg text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ))}
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 ${
                loading ? "bg-gray-400" : "bg-gradient-to-r from-blue-500 to-cyan-500"
              } text-white rounded-lg shadow-lg ${
                loading ? "cursor-not-allowed" : "hover:from-blue-600 hover:to-cyan-600"
              } transition-all text-lg font-semibold`}
            >
              {loading ? "Verifying..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmailVerify;
