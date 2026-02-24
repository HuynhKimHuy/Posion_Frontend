import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { chatState } from "@/types/store";
import { fetchConversations } from "@/service/chatSevice";

export const useChatStore = create<chatState>()(
    persist(
        (set) => ({
            conversations: [],
            messages: {},
            activeConversationId: null,
            loading: false,

            setActiveConversation: (conversationId) => {
                set({ activeConversationId: conversationId });
            },
            resetChatState: () => {
                set({
                    conversations: [],
                    messages: {},
                    activeConversationId: null,
                    loading: false,
                })
            },
            loadConversations: async (accessToken) => {
                try {
                    set({ loading: true })
                    if (!accessToken) {
                        set({ loading: false })
                        return
                    }
                    const { conversations } = await fetchConversations(accessToken);
                    set({ conversations, loading: false })
                } catch (error) {
                    console.log(error);
                    set({ loading: false })
                }
            }

        }),
        {
            name: "chat-storage",
            partialize: (state) => ({
                conversations: state.conversations,
            })
        }
    )
)
