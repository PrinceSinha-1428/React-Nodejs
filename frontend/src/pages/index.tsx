import { useAuth } from "../context/Authcontext";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to={"/sign-in"} />;

  return <Outlet />;
};

export const AdminRoute = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to={"/sign-in"} />;
  if (user.role !== "Admin" && user.role !== "Super Admin")
    return <Navigate to={"/"} />;

  return <Outlet />;
};

export default ProtectedRoutes;
