import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { chatState } from "@/types/store";
import { fetchConversations, fetchMessages } from "@/service/chatSevice";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create<chatState>()(
    persist(
        (set, get) => ({
            conversations: [],
            messages: {},
            activeConversationId: null,
            loading: false,
            messagesLoading: false,
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
                    const { conversations } = await fetchConversations();
                    set({ conversations, loading: false })
                } catch (error) {
                    console.error("❌ [useChatStore] Error loading conversations:", error);
                    set({ loading: false })
                }
            },


            /*
            {
                 "message": "Get conversation messages successfully",
                 "status": 200,
                "metadata": {
                "messages": [
                {
                    "_id": "69a1703df8fe6c17100c1654",
                    "conversation": "69a1703df8fe6c17100c1652",
                    "senderId": "698e9baeebf6e011ca834a26",
                    "content": "Helo Đây là Tin nhắn thứ 1 tới Huy 20",
                    "createdAt": "2026-02-27T10:21:49.971Z",
                    "updatedAt": "2026-02-27T10:21:49.971Z",
                "__v": 0
                }
        ],
        "nextCursor": null
    },
    "ResponseStatus": "OK"
            */
            fetchMessages: async (conversationId) => {
                const { activeConversationId, messages } = get()
                const { user } = useAuthStore.getState()

                const converId = conversationId || activeConversationId
                if (!converId) return

                const currentMessages = messages?.[converId]
                const nextCurrsor = currentMessages?.nextCursor === undefined ? null : currentMessages?.nextCursor
                if (nextCurrsor === null) return
                set({ messagesLoading: true })
                try {

                    const { messages: fetched, cursor } = await fetchMessages(converId, nextCurrsor)

                } catch (error) {

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
