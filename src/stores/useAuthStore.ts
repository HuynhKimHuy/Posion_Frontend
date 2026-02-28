import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";
import { authService } from "@/service/authService";
import type { authState } from "@/types/store";
import { useChatStore } from "./useChatStore";

export const useAuthStore = create<authState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      user: null,
      loading: false,

      clearState: () => {
        set({
          accessToken: null,
          user: null,
          loading: false,
        });
        localStorage.removeItem('auth-storage');
        localStorage.removeItem('chat-storage');
        useChatStore.getState().resetChatState();
      },

      signUp: async (userName, password, email, firstName, lastName) => {
        try {
          set({ loading: true });
          await authService.signUp(userName, password, email, firstName, lastName);
          toast.success("Đăng ký thành công!");
        } catch (error) {
          toast.error("Đăng ký thất bại");
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

          toast.success("Đăng nhập thành công!");
          return true;
        } catch (error) {
          toast.error("Đăng nhập thất bại");
          return false;
        } finally {
          set({ loading: false });
        }
      },

      logOut: async () => {
        try {
          await authService.logOut();
          toast.success("Đã đăng xuất");
        } catch (error) {
          toast.error("Lỗi khi đăng xuất");
        } finally {
          get().clearState();
          window.location.href = "/signin";
        }
      },

      fetchMe: async (accessToken: string) => {
        try {
          set({ loading: true });
          const user = await authService.fetchMe(accessToken);
          set({ user });
          return user;
        } catch (error) {
          console.error("Fetch user error:", error);
          return null;
        } finally {
          set({ loading: false });
        }
      },

      refresh:async()=>{
        try{
          set({loading: true})
          const newAccessToken = await authService.refresh();
          set({ accessToken: newAccessToken });
          return newAccessToken;

        } catch(error) {
          console.error("Refresh token error:", error);
          return null;
        } finally {
          set({ loading: false });
        }
      }
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
      })
    }
  )
);
