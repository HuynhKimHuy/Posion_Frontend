import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { chatState } from "@/types/store"
import type { Conversation, Message } from "@/types/chat"
import { fetchConversations, fetchMessages, markConversationAsRead, sendDirectMessage, sendGroupMessage } from "@/service/chatSevice"
import { useAuthStore } from "./useAuthStore"

// ─── Read-sync guards ─────────────────────────────────────────────────────────
const COOLDOWN = 450
const inFlight = new Set<string>()
const lastSyncAt = new Map<string, number>()

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Get user's unread count for a conversation
const getUnread = (conv: Conversation | null | undefined, uid?: string) =>
	!conv || !uid ? 0 : (conv.unreadCounts?.[uid] ?? 0)

// Insert or move an incoming conversation to top of list, zero unread if active
const upsert = (list: Conversation[], incoming: Conversation, uid?: string, activeId?: string | null) => {
	const existing = list.find((c) => c._id === incoming._id)
	const merged: Conversation = {
		...(existing ?? {}),
		...incoming,
		unreadCounts: { ...(existing?.unreadCounts ?? {}), ...(incoming.unreadCounts ?? {}) },
	}
	if (uid && activeId === merged._id) merged.unreadCounts = { ...merged.unreadCounts, [uid]: 0 }
	return [merged, ...list.filter((c) => c._id !== incoming._id)]
}

// Returns true if marking as read should be skipped
const skipSync = (conv: Conversation, uid: string, force: boolean) => {
	if (String(conv.lastMessage?.sender?._id) === uid) return true   // I sent the last message
	if (force) return false
	return getUnread(conv, uid) === 0 || (conv.seenBy ?? []).some((u) => String(u._id) === uid)
}

// Normalize raw message from API or socket into a consistent shape
const normalizeMsg = (raw: any, fallbackConvoId: string, fallbackSenderId: string): Message => ({
	...raw,
	conversationId: String(raw.conversationId || raw.conversation || fallbackConvoId),
	senderId: String(raw.senderId || fallbackSenderId),
})

// Update the displayed lastMessage.content for a conversation in the list
const patchContent = (list: Conversation[], id: string, content: string) =>
	list.map((c) => (c._id !== id || !c.lastMessage ? c : { ...c, lastMessage: { ...c.lastMessage, content } }))

// ─── Store ────────────────────────────────────────────────────────────────────
export const useChatStore = create<chatState>()(
	persist(
		(set, get) => ({
			conversations: [],
			messages: {},
			activeConversationId: null,
			loading: false,
			messagesLoading: false,

			// Open a conversation: zero unread locally, then sync to server
			setActiveConversation: (conversationId) => {
				const uid = useAuthStore.getState().user?._id
				const target = conversationId ? get().conversations.find((c) => c._id === conversationId) : null
				const hadUnread = getUnread(target, uid) > 0

				set((s) => ({
					activeConversationId: conversationId,
					conversations: s.conversations.map((c) =>
						conversationId && uid && c._id === conversationId
							? { ...c, unreadCounts: { ...c.unreadCounts, [uid]: 0 } }
							: c
					),
				}))

				if (conversationId) void get().markConversationAsRead(conversationId, hadUnread)
			},

			resetChatState: () => {
				set({ conversations: [], messages: {}, activeConversationId: null, loading: false })
				localStorage.removeItem("chat-storage")
			},

			loadConversations: async () => {
				try {
					set({ loading: true })
					const { conversations } = await fetchConversations()
					set({ conversations, loading: false })
				} catch (e) {
					console.error("loadConversations failed", e)
					set({ loading: false })
				}
			},

			fetchMessages: async (conversationId) => {
				const targetId = conversationId || get().activeConversationId
				if (!targetId) return

				const current = get().messages?.[targetId]
				if (current && current.nextCursor === null) return // no more pages

				set({ messagesLoading: true })
				try {
					const uid = useAuthStore.getState().user?._id
					const { messages: fetched, cursor } = await fetchMessages(targetId, current?.nextCursor ?? undefined)
					const items = fetched.map((m) => ({ ...m, isOwn: m.senderId === uid }))

					set((s) => {
						const prev = s.messages[targetId]?.items ?? []
						return {
							messages: {
								...s.messages,
								[targetId]: { items: prev.length > 0 ? [...items, ...prev] : items, hasMore: !!cursor, nextCursor: cursor ?? null },
							},
						}
					})
				} catch (e) {
					console.error("fetchMessages failed", e)
				} finally {
					set({ messagesLoading: false })
				}
			},

			// Sync read status to server, with cooldown + in-flight dedup
			markConversationAsRead: async (conversationId, forceSync = false) => {
				const user = useAuthStore.getState().user
				if (!conversationId || !user?._id) return

				const now = Date.now()
				if (inFlight.has(conversationId) || now - (lastSyncAt.get(conversationId) ?? 0) < COOLDOWN) return

				const conv = get().conversations.find((c) => c._id === conversationId)
				if (!conv?.lastMessage || skipSync(conv, String(user._id), forceSync)) return

				try {
					inFlight.add(conversationId)
					const updated = await markConversationAsRead(conversationId)
					lastSyncAt.set(conversationId, Date.now())
					if (updated) get().updateConversation(updated)
				} catch (e) {
					console.error("markConversationAsRead failed", e)
				} finally {
					inFlight.delete(conversationId)
				}
			},

			sendDirectMessage: async (recipientId, content, imageUrl, conversationId) => {
				try {
					const uid = useAuthStore.getState().user?._id
					const targetId = conversationId || get().activeConversationId
					const res = await sendDirectMessage(recipientId, content, imageUrl, targetId || undefined)

					if (res?.message) await get().addMessage(normalizeMsg(res.message, String(targetId || res?.conversation?._id || ""), String(uid || "")))
					if (res?.conversation) get().updateConversation(res.conversation)

					// New conversation just created — reload full list instead of patching
					if (!targetId && !res?.conversation) { await get().loadConversations(); return }

					set((s) => ({ conversations: patchContent(s.conversations, String(targetId || res?.conversation?._id || ""), content) }))
				} catch (e) {
					console.error("sendDirectMessage failed", e)
				}
			},

			sendGroupMessage: async (conversationId, content, imageUrl) => {
				try {
					const res = await sendGroupMessage(conversationId, content, imageUrl)
					if (res?.message) await get().addMessage(normalizeMsg(res.message, conversationId, String(res.message.senderId || "")))
					if (res?.conversation) get().updateConversation(res.conversation)
					set((s) => ({ conversations: patchContent(s.conversations, conversationId, content) }))
				} catch (e) {
					console.error("sendGroupMessage failed", e)
				}
			},

			addMessage: async (message) => {
				const uid = useAuthStore.getState().user?._id
				const convoId = String(message.conversationId)

				set((s) => {
					const prev = s.messages?.[convoId]?.items ?? []
					if (prev.some((m) => m._id === message._id)) return s // dedup

					return {
						messages: {
							...s.messages,
							[convoId]: {
								...s.messages?.[convoId],
								items: [...prev, { ...message, conversationId: convoId, senderId: String(message.senderId), isOwn: String(message.senderId) === uid }],
								hasMore: s.messages?.[convoId]?.hasMore ?? true,
								nextCursor: s.messages?.[convoId]?.nextCursor ?? null,
							},
						},
					}
				})
			},

			updateConversation: (conversation) => {
				const uid = useAuthStore.getState().user?._id
				set((s) => ({ conversations: upsert(s.conversations, conversation, uid, s.activeConversationId) }))
			},
		}),
		{ name: "chat-storage", partialize: (s) => ({ conversations: s.conversations }) }
	)
)
