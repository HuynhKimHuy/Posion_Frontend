import { toast } from "sonner";
import { create } from "zustand";
import { isAxiosError } from "axios";
import { userService } from "@/service/userService";
import type { UserState } from "@/types/store";
import { useAuthStore } from "./useAuthStore";
import { useChatStore } from "./useChatStore";

export const userStore = create<UserState>(() => ({
    updateAvatar: async (formData: FormData) => {
        try {
            const updatedUser = await userService.uploadAvatar(formData);

            // Cập nhật user trong auth store
            useAuthStore.setState({ user: updatedUser });
            // Đảm bảo toàn bộ thông tin user được đồng bộ (lấy lại từ API nếu cần)
            const accessToken = useAuthStore.getState().accessToken;
            if (accessToken) {
                const freshUser = await useAuthStore.getState().fetchMe(accessToken);
                if (freshUser) {
                    useAuthStore.setState({ user: freshUser });
                }
            }

            // Đồng bộ avatar vào các cuộc hội thoại để UI cập nhật ngay
            const { conversations, setActiveConversation, activeConversationId } = useChatStore.getState();
            const patchedConversations = conversations.map((conversation) => ({
                ...conversation,
                participants: conversation.participants.map((participant) =>
                    participant.userId === updatedUser?._id
                        ? { ...participant, avatarUrl: updatedUser?.avatarUrl }
                        : participant
                ),
                lastMessage: conversation.lastMessage && conversation.lastMessage.sender
                    ? {
                        ...conversation.lastMessage,
                        sender: conversation.lastMessage.sender._id === updatedUser?._id
                            ? { ...conversation.lastMessage.sender, avatarUrl: updatedUser?.avatarUrl }
                            : conversation.lastMessage.sender,
                    }
                    : conversation.lastMessage,
            }));
            useChatStore.setState({ conversations: patchedConversations });
            if (activeConversationId) {
                setActiveConversation(activeConversationId);
            }

            toast.success("Cập nhật avatar thành công!");
            return updatedUser;
        } catch (error) {
            console.error("updateAvatar failed", error);
            const message = isAxiosError(error)
                ? error.response?.data?.message
                : null;
            toast.error(message || "Không thể cập nhật avatar");
            return null;
        }
    },
}));