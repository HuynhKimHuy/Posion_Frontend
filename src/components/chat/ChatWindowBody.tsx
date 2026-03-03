import { useChatStore } from "@/stores/useChatStore"
import { useAuthStore } from "@/stores/useAuthStore"
import MessageItem from "./Chat Card/MessageItemProp"


const ChatWindowBody = () => {
    const {activeConversationId,
        messages: allMessages,
        } = useChatStore()
    const currentUserId = useAuthStore((state) => state.user?._id)
    const messages = activeConversationId
        ? (allMessages[activeConversationId!]?.items ?? [])
        : []
    const selectedConversation = useChatStore((state) => state.conversations.find(c => c._id === activeConversationId))
    
    if(!selectedConversation){
        return null
    }
    
    if(!messages?.length) {
        return(<div className="flex h-full w-full items-center justify-center">No messages in this conversation</div>)
    }

    const isLastMessageOwn = selectedConversation.lastMessage?.sender?._id === currentUserId
    const hasOtherUserSeen = selectedConversation.seenBy?.some((user) => user._id !== currentUserId)
    const lastMessageStatus: "seen" | "delivered" | "sent" = isLastMessageOwn
        ? (hasOtherUserSeen ? "seen" : "delivered")
        : "sent"

    return (
        <div className="px-4 py-4 bg-primary-forground h-full flex flex-col overflow-y-auto gap-4">   
             <div className="flex flex-col overflow-y-auto overflow-x-hidden beautiful-scrollbar gap-4">
                {messages.map((message, index) => (
                    <div key={message._id} className="content">
                        <MessageItem
                            message={message}
                            index={index}
                            messages={messages}
                            selectedConvo={selectedConversation}
                            lastMessageStatus={lastMessageStatus}
                        />
                    </div>
                ))}
             </div>
        </div>
    )
}

export default ChatWindowBody