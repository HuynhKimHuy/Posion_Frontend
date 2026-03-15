import { create } from 'zustand'
import { io, type Socket } from 'socket.io-client'
import { useAuthStore } from './useAuthStore'
import { useChatStore } from './useChatStore'


interface SocketState {
    socket: Socket | null
    connectSocket: () => void
    disconnectSocket: () => void
    onlineUsers: string[]
}

interface NewMessagePayload {
    message?: {
        _id: string
        conversationId?: string
        conversation?: string
        senderId: string
        content: string | null
        imgUrl?: string | null
        createdAt: string
        updatedAt?: string
    }
    conversation?: any
    unreadCounts?: Record<string, number>
}

const baseURL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'

export const useSocketStore = create<SocketState>((set, get) => ({
    socket: null,
    onlineUsers: [],
    connectSocket: () => {
        const accessToken = useAuthStore.getState().accessToken

        if (!accessToken) {
            get().disconnectSocket()
            return
        }

        const exsittingSocket = get().socket
        if (exsittingSocket) {
            exsittingSocket.auth = { token: accessToken }
            if (!exsittingSocket.connected) {
                exsittingSocket.connect()
            }
            return
        }
        const socket = io(baseURL, {
            auth: {
                token: accessToken
            },
            transports: ['websocket']
        })

        set({ socket })
        socket.on("connect", () => {
            console.log("✅ Socket connected:", socket.id)
        })
        socket.on("connect_error", (error) => {
            console.error("❌ Socket connect error:", error.message)
        })
        socket.on("online-users", (users: string[]) => {
            set({ onlineUsers: users })
        })

        socket.on("new-message", (payload: NewMessagePayload) => {
            if (!payload?.message || !payload?.conversation?._id) return

            const conversationId = String(
                payload.message.conversationId || payload.message.conversation || payload.conversation._id
            )

            const normalizedMessage = {
                ...payload.message,
                conversationId,
                senderId: String(payload.message.senderId),
            }

            useChatStore.getState().addMessage(normalizedMessage)

            const activeConversationId = useChatStore.getState().activeConversationId
            const userId = useAuthStore.getState().user?._id
            const mergedUnreadCounts = {
                ...(payload.conversation.unreadCounts || {}),
                ...(payload.unreadCounts || {}),
            }

            if (userId && activeConversationId === payload.conversation._id) {
                mergedUnreadCounts[userId] = 0
                void useChatStore.getState().markConversationAsRead(payload.conversation._id)
            }

            useChatStore.getState().updateConversation({
                ...payload.conversation,
                unreadCounts: mergedUnreadCounts,
            })
        })

        socket.on("conversation-read", (payload: { conversation?: any }) => {
            if (!payload?.conversation?._id) return
            useChatStore.getState().updateConversation(payload.conversation)
        })

        socket.on("disconnect", (reason) => {
            console.log("🔌 Socket disconnected:", reason)
        })
    },

    disconnectSocket: () => {
        const { socket } = get()
        if (socket) {
            socket.disconnect()
            set({ socket: null, onlineUsers: [] })
        }
    },

}))
