import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user } = useAuth();

  // User login nahi
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role check
  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(user.role)
  ) {
    return <Navigate to="/login" replace />;
  }

  // User allowed aahe
  return children;
}

export default ProtectedRoute;
