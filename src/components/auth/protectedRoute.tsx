import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect } from "react";
import { useState } from "react";

const withTimeout = async <T,>(promise: Promise<T>, ms = 8000): Promise<T> => {
  return await Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => reject(new Error("Auth init timeout")), ms);
    }),
  ]);
};

const ProtectedRoute = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);
  const refresh = useAuthStore((state) => state.refresh);
  const fetchMe = useAuthStore((state) => state.fetchMe);
  const [starting, setStarting] = useState(true);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        let token = accessToken;
        if (!token) {
          token = await withTimeout(refresh());
        }

        if (token && !useAuthStore.getState().user) {
          await withTimeout(fetchMe(token));
        }
      } catch (error) {
        console.error("Init error:", error);
      } finally {
        if (mounted) {
          setStarting(false);
        }
      }
    }

    void init();
    return () => {
      mounted = false;
    };
  }, [accessToken, fetchMe, refresh]);

  if (starting) {
    return <div className="w-screen h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!accessToken || !user) {
    return <Navigate to="/signin" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
