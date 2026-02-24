import { Navigate, Outlet, useLocation } from "react-router";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";

const ProtectedRoute = () => {
  const { user, accessToken, loading, refresh, fetchMe } = useAuthStore();
  const loadConversations = useChatStore((state) => state.loadConversations);
  const location = useLocation();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Nếu đã có user từ store (vừa đăng nhập), không cần refresh lại
        if (user && accessToken) {
          await loadConversations(accessToken);
          setChecking(false);
          return;
        }

        // Nếu không có user, thử refresh token để lấy thông tin mới
        const newToken = await refresh();

        // Nếu refresh thành công, lấy user info
        if (newToken) {
          await fetchMe(newToken);
          await loadConversations(newToken);
        }
      } catch (error) {
        console.log("Auth check error:", error);
      } finally {
        setChecking(false);
      }
    };

    checkAuth();
  }, [accessToken, fetchMe, loadConversations, refresh, user]); // Empty dependency array - chỉ chạy 1 lần khi mount

  if (checking || loading) {
    return <div className="flex h-screen">Đang tải trang...</div>;
  }

  // Nếu không có user sau khi check, redirect to signin
  if (!user) {
    return (
      <Navigate
        to="/signin"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
