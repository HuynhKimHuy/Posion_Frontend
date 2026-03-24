import { toast } from "sonner";
import { create } from "zustand";
import { isAxiosError } from "axios";
import { userService } from "@/service/userService";
import type { UserState } from "@/types/store";
import { useAuthStore } from "./useAuthStore";

export const userStore = create<UserState>(() => ({
    updateAvatar: async (formData: FormData) => {
        try {
            const { user, setUser } = useAuthStore.getState();
            const data = await userService.uploadAvatar(formData);

            if (!user) {
                return null;
            }

            const updatedUser = {
                ...user,
                avatarUrl: data?.avatarUrl ?? user.avatarUrl,
            };

            setUser(updatedUser);
            return updatedUser;
        } catch (error) {
            console.log("Loi khi cap nhat avatar");

            if (isAxiosError(error)) {
                toast.error(error.response?.data?.message ?? "Failed to update avatar. Please try again.");
            } else {
                toast.error("Failed to update avatar. Please try again.");
            }

            return null;
        }
    },
}));