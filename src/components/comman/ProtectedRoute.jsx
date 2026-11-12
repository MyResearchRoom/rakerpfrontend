import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { ADMIN } from "../../constants/role";

export const ProtectedRoute = ({ allowedRoles = [], routeName, children }) => {
  const { token, role, authLoading, accessRoute } = useSelector((state) => state.auth);

  if (authLoading) {
    return <div>Loading...</div>;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length && !allowedRoles.includes(role)) {
    return <Navigate to="/unauth" replace />;
  }

  if (role !== ADMIN && !accessRoute.includes(routeName)) {
    return <Navigate to="/unauth" replace />;
  }

  return children ? children : <Outlet />;
};