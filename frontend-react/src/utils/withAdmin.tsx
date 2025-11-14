import type { ComponentType } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.js";

const withAdmin = <P extends object>(Component: ComponentType<P>) => {
  const Wrapped = (props: P) => {
    const { isAdmin } = useAuth();
    if (!isAdmin) {
      return <Navigate to="/books" replace />;
    }
    return <Component {...props} />;
  };
  return Wrapped;
};

export { withAdmin };
