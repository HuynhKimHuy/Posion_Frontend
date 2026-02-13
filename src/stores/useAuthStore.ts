import { create } from "zustand";
import { toast } from "sonner";
import { authService } from "@/service/authService";
import type { authState } from "@/types/store";

type ApiError = {
  response?: {
    status?: number;
    data?: {
      message?: string;
    };
  };
};

export const useAuthStore = create<authState>((set, get) => ({
  accessToken: null,
  user: null,
  loading: false,

  clearState: async () => {
    set({
      accessToken: null,
      user: null,
      loading: false,
    });
  },

  signUp: async (userName, password, email, firstName, lastName) => {
    try {
      set({ loading: true });
      await authService.signUp(userName, password, email, firstName, lastName);
      toast.success("Đăng kí thành công! bạn sẽ được chuyển đến trang đăng nhập");
    } catch (error) {
      console.log(error);
      toast.error(" Đăng kí không thành công ");
    } finally {
      set({ loading: false });
    }
  },

  signIn: async (email, password) => {
    try {
      set({ loading: true });
      const res = await authService.signIn(email, password);
      const accessToken = res?.metadata?.tokens?.accessToken;
      if (!accessToken) throw new Error("Missing access token");

      set({ accessToken });
      await get().fetchMe(accessToken);
      toast.success("wellcome back");
      return true;
    } catch (error) {
      console.log(error);
      toast.error("login in error");
      return false;
    } finally {
      set({ loading: false });
    }
  },

  logOut: async () => {
    try {
      get().clearState();
      await authService.logOut();
      toast.success("Đã đăng xuất");
    } catch (error) {
      console.log(error);
      toast.error("Lỗi Khi Đăng Xuất");
    }
  },

  fetchMe: async (accessToken: string) => {
    try {
      set({ loading: true });
      if (!accessToken) throw new Error("Missing access token");
      const user = await authService.fetchMe(accessToken);
      set({ user });
      return user;
    } catch (error) {
      console.log(error);
      toast.error("Không lấy được thông tin user");
      return null;
    } finally {
      set({ loading: false });
    }
  },

  refresh: async () => {
    try {
      set({ loading: true });
      const res = await authService.refresh();
      set({ accessToken: res });
      return res;
    } catch (error) {
      console.log(error);
      const status = (error as ApiError)?.response?.status;
      const message = (error as ApiError)?.response?.data?.message;
      const isMissingRefreshToken = status === 400 && message === "Missing refresh token";

      if (!isMissingRefreshToken) {
        toast.error("Refresh token lỗi");
      }

      get().clearState();
      return null;
    } finally {
      set({ loading: false });
    }
  },
}));
