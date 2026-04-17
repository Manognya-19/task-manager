import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";

export const useUserAuth = () => {
  const { user, loading, clearUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    // ⏳ wait until auth check is finished
    if (loading) return;
    if (user) return;

    // ❌ not logged in → go to login
    if (!user) {
      clearUser();
      navigate("/login");
    }
  }, [user, loading, clearUser, navigate]);
};
