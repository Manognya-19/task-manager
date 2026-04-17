import React, { createContext, useState, useEffect, useContext } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

export const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
         setUser({
      id: response.data._id,
      name: response.data.name,
      email: response.data.email,
      role: response.data.role,
      profileImageUrl: response.data.profileImageUrl,
    });
      } catch (err) {
        clearUser();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

const updateUser = (userData) => {
  setUser({
    id: userData.id,
    name: userData.name,
    email: userData.email,
    role: userData.role,
    profileImageUrl: userData.profileImageUrl || "",
    token: userData.token,
  });

  if (userData.token) {
    localStorage.setItem("token", userData.token);
  }
};

  const clearUser = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <UserContext.Provider value={{ user, loading, updateUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;

