import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../../redux/Store";
import type { ReactNode } from "react";

export function RequireAuth({ children }: { children: ReactNode }) {
  const user = useAppSelector((s) => s.auth.user);
  const location = useLocation();
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  return <>{children}</>;
}

export function RequireAdmin({ children }: { children: ReactNode }) {
  const user = useAppSelector((s) => s.auth.user);
  const location = useLocation();
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  if (user.role !== "ADMIN" && user.role !== "MANAGER") {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}
