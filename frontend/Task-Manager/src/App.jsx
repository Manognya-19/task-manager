import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate
} from "react-router-dom";

import Dashboard from "./pages/Admin/Dashboard";
import Login from "./pages/Auth/login";
import SignUp from "./pages/Auth/SignUp";
import ManageTasks from "./pages/Admin/ManageTasks";
import CreateTask from "./pages/Admin/CreateTask";
import ManageUsers from "./pages/Admin/ManageUsers";
import UserDashboard from "./pages/User/UserDashboard";
import MyTasks from "./pages/User/MyTasks";
import ViewTaskDetails from "./pages/User/ViewTaskDetails";
import PrivateRoute from "./routes/PrivateRoute";
import UserProvider, {UserContext} from "./context/userContext";   // make sure this file exists
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <UserProvider>
     <Toaster position="top-right" reverseOrder={false} />

    <div>
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Admin protected routes */}
        <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/tasks" element={<ManageTasks />} />
          <Route path="/admin/create-task" element={<CreateTask />} />
          <Route path="/admin/users" element={<ManageUsers />} />
        </Route>

        {/* User protected routes */}
        <Route element={<PrivateRoute allowedRoles={["user"]} />}>
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/user/tasks" element={<MyTasks />} />
          <Route path="/user/tasks-details/:id" element={<ViewTaskDetails />} />
        </Route>
        {/* Default Route */}
        <Route path='/' element={<Root />} />
      </Routes>
    </Router>
    </div>

    {/* <Toaster
     toastOptions={
      {
        className: "",
        style:{
          fontSize: "13px",
        },
      }
     }
     /> */}
    </UserProvider>
  );
};

export default App;

const Root = () => {
  const { user, loading } = useContext(UserContext);

  // Show nothing or loader while checking auth
  if (loading) return <Outlet/>

  // Not logged in → Login page
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Redirect based on role
  return user.role === "admin" ?
    <Navigate to="/admin/dashboard"/> : <Navigate to="/user/dashboard" />
};
