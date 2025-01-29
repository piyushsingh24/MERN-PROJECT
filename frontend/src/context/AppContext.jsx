import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";


export const AppContent = createContext();

export const AppContextProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [UserData, setUserData] = useState({});

  // Fetch user data
  const getUserData = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.get("https://mern-project-backend-tdgu.onrender.com/api/user/data");
      if (data.success) {
        setIsLoggedIn(true);
        setUserData(data.userData)
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to fetch user data.");
    }
  };

  return (
    <AppContent.Provider value={{ isLoggedIn, setIsLoggedIn, UserData, setUserData, getUserData }}>
      {children}
    </AppContent.Provider>
  );
};

export default AppContextProvider;
