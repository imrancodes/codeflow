import { useUser } from "@/api/useUser";
import type React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { data, isLoading, error } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <Navigate to="/login" replace />;
  if (!data) return <Navigate to="/login" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;
