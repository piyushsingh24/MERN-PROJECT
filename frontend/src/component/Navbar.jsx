import React, { useContext , useEffect } from "react";
import { assets } from "../assets/assets.js";
import { MoveRight } from "lucide-react";
import { AppContent } from "../context/AppContext.jsx";
import axios from "axios"
import {toast} from "react-toastify"
import {useNavigate} from "react-router-dom"

const Navbar = () => {
  const { isLoggedIn } = useContext(AppContent);
  const navigate = useNavigate()

  const logout = async()=>{
    try {
      axios.defaults.withCredentials = true;
      const {data} = await axios.post("https://mern-project-backend-tdgu.onrender.com/api/auth/logout");
      toast.success("Logged out successfully!");
      navigate('/login')
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className=" w-full flex justify-between items-center px-4 py-2">
      <a href="/">
        <img src={assets.logo} alt="" className="w-36" />
      </a>

      <div>
        {isLoggedIn ? (
          <button
            onClick={logout}
            className='flex border-[1px] hover:bg-red-600 hover:text-white md:font-semibold justify-center md:py-2 px-4 rounded-full'
          >
            Logout <MoveRight className='w-6' />
          </button>
        ) : (
          <a href="/login">
            <button
              className='flex border-[1px] hover:bg-amber-600 hover:text-white md:font-semibold justify-center md:py-2 px-4 rounded-full'
            >
              Login <MoveRight className='w-6' />
            </button>
          </a>
        )}
      </div>
    </div>
  );
};

export default Navbar;
