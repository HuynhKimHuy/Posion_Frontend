import { useChatStore } from "@/stores/useChatStore"
import { useAuthStore } from "@/stores/useAuthStore"
import MessageItem from "./Chat Card/MessageItemProp"
import { useLayoutEffect, useRef } from "react"


const ChatWindowBody = () => {
    const { activeConversationId,
        messages: allMessages,
    } = useChatStore()
    const currentUserId = useAuthStore((state) => state.user?._id)
    const messages = activeConversationId
        ? (allMessages[activeConversationId!]?.items ?? [])
        : []
    const selectedConversation = useChatStore((state) => state.conversations.find(c => c._id === activeConversationId))
    const messagesEndRef = useRef<HTMLDivElement>(null)

    useLayoutEffect(() => {
       if(!messagesEndRef.current) return
       messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }, [messages.length, activeConversationId])


    if (!selectedConversation) {
        return null
    }

    if (!messages?.length) {
        return (<div className="flex h-full w-full items-center justify-center">No messages in this conversation</div>)
    }

    const lastOwnMessageId = [...messages].reverse().find((m) => m.isOwn)?._id

    const hasOtherUserSeen = selectedConversation.seenBy?.some((user) => user._id !== currentUserId)
    const otherParticipants = selectedConversation.participants.filter(
        (participant) => participant.userId !== currentUserId
    )
    const allOthersRead = otherParticipants.length > 0 && otherParticipants.every(
        (participant) => (selectedConversation.unreadCounts?.[participant.userId] || 0) === 0
    )

    const lastMessageStatus: "seen" | "read" | "delivered" = hasOtherUserSeen ? "seen" : allOthersRead ? "read" : "delivered"


    return (
        <div className="beautiful-scrollbar h-full min-h-0 overflow-y-auto overflow-x-hidden bg-background px-4 py-4">
            <div className="flex flex-col gap-4">
                {messages.map((message, index) => (
                    <div key={message._id} className="content">
                        <MessageItem
                            message={message}
                            index={index}
                            messages={messages}
                            selectedConvo={selectedConversation}
                            lastMessageStatus={lastMessageStatus}
                            lastOwnMessageId={lastOwnMessageId}
                        
                        />
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
        </div>
    )
}

export default ChatWindowBody