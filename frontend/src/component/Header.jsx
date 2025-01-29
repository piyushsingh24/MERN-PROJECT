import React, { useContext, useEffect } from "react";
import { assets } from "../assets/assets";
import { MoveRight } from "lucide-react"
import { AppContent } from "../context/AppContext";
import { useNavigate } from "react-router-dom";


const Header = () => {

  const { UserData , isLoggedIn } = useContext(AppContent)
  const navigate = useNavigate()


  return (  
    <div className="w-full h-[80vh] flex justify-center  items-center flex-col">
      <img src={assets.header_img} alt="" className="w-40 h-48 aspect-square" />

      <h1 className="flex text-2xl items-center text-center">
        Hey {isLoggedIn ? UserData.name : "Developer"},
        <img src={assets.hand_wave} alt="" className="w-8 h-8 mx-2" />
      </h1>

      <h1 className="text-4xl text-center">Welcome To Your app</h1>

      <p className="w-96 text-center my-4 text-lg">
        Let's Start with a quick product four and we will have you up and
        running in no time!
      </p>

      <div>
          <a href="/login">
            <button className='flex border-[1px]  hover:bg-amber-600 hover:text-white md:font-semibold justify-center md:py-2 px-6 rounded-full'  >
              Get Started            
            </button>
          </a>
        </div>
    </div>
  );
};

export default Header;
