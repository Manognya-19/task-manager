import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../context/userContext";

const PrivateRoute = ({ allowedRoles }) => {
  const { user, loading } = useUser();

  if (loading) return null;

  if (!user) return <Navigate to="/login" />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default PrivateRoute;
