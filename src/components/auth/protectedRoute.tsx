import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect } from "react";
import { useState } from "react";

const ProtectedRoute = () => {
  const { accessToken, refresh, fetchMe } = useAuthStore();
  const [starting, setStarting] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        let token = accessToken;
        if (!token) {
          token = await refresh();
        }
        if (token && !useAuthStore.getState().user) {
          await fetchMe(token);
        }
      } catch (error) {
        console.error("Init error:", error);
      } finally {
        setStarting(false);
      }
    }
    init();
  }, []);

  if (starting) {
    return <div className="w-screen h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!accessToken) {
    return <Navigate to="/signin" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
