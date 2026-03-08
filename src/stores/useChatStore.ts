import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { chatState } from "@/types/store"
import {
	fetchConversations,
	fetchMessages,
	sendDirectMessage,
} from "@/service/chatSevice"
import { useAuthStore } from "./useAuthStore"

export const useChatStore = create<chatState>()(
	persist(
		(set, get) => ({
			conversations: [],
			messages: {},
			activeConversationId: null,
			loading: false,
			messagesLoading: false,

			setActiveConversation: (conversationId) => {
				set({ activeConversationId: conversationId })
			},

			resetChatState: () => {
				set({
					conversations: [],
					messages: {},
					activeConversationId: null,
					loading: false,
				})
				localStorage.removeItem("chat-storage")
			},

			loadConversations: async () => {
				try {
					set({ loading: true, conversations: [] })
					const { conversations } = await fetchConversations()
					set({ conversations, loading: false })
				} catch (error) {
					console.error("❌ [useChatStore] Error loading conversations:", error)
					set({ loading: false })
				}
			},

			fetchMessages: async (conversationId) => {
				const { activeConversationId, messages } = get()
				const { user } = useAuthStore.getState()

				const converId = conversationId || activeConversationId
				if (!converId) return

				const currentMessages = messages?.[converId]
				const nextCursor = currentMessages?.nextCursor
				const isFirstLoad = !currentMessages

				if (!isFirstLoad && nextCursor === null) return

				set({ messagesLoading: true })

				try {
					const { messages: fetched, cursor } = await fetchMessages(
						converId,
						nextCursor ?? undefined
					)

					const processedMessages = fetched.map((msg) => ({
						...msg,
						isOwn: msg.senderId === user?._id,
					}))

					set((state) => {
						const prev = state.messages[converId]?.items ?? []
						const merged =
							prev.length > 0
								? [...processedMessages, ...prev]
								: processedMessages

						return {
							messages: {
								...state.messages,
								[converId]: {
									items: merged,
									hasMore: !!cursor,
									nextCursor: cursor ?? null,
								},
							},
						}
					})
				} catch (error) {
					console.log("lỗi xảy ra khi fetchMessages", error)
				} finally {
					set({ messagesLoading: false })
				}
			},

			sendDirectMessage: async (receiverId, content, imageUrl, conversationId) => {
				try {
					const { activeConversationId } = get()
					const targetConversationId = conversationId || activeConversationId

					await sendDirectMessage(
						receiverId,
						content,
						imageUrl,
						targetConversationId || undefined
					)

					if (!targetConversationId) return

					set((state) => ({
						conversations: state.conversations.map((c) => {
							if (c._id !== targetConversationId) return c
							if (!c.lastMessage) return c

							return {
								...c,
								lastMessage: {
									...c.lastMessage,
									content,
								},
							}
						}),
					}))
				} catch (error) {
					console.error("lỗi xảy ra khi sendDirectMessage", error)
				}
			},

			sendGroupMessage: async (_conversationId, _content, _imageUrl) => {
				// Implementation will be added later
			},
		}),
		{
			name: "chat-storage",
			partialize: (state) => ({
				conversations: state.conversations,
			}),
		}
	)
)
