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
                // Clear localStorage
                localStorage.removeItem('chat-storage');
            },
            loadConversations: async () => {
                try {
                    set({ loading: true, conversations: [] })
                    console.log("📡 [useChatStore] Fetching conversations...")
                    const { conversations } = await fetchConversations();
                    console.log("✅ [useChatStore] Conversations loaded:", conversations)
                    set({ conversations, loading: false })
                } catch (error) {
                    console.error("❌ [useChatStore] Error loading conversations:", error);
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
