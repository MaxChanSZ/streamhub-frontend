import { useAppContext } from "@/contexts/AppContext";
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isLoggedIn } = useAppContext();
  if (!isLoggedIn) {
    // user is not authenticated
    return <Navigate to="start" />;
  }
  return children;
};
