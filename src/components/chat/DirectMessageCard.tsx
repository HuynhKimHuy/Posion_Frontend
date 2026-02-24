import type { Conversation } from "@/types/chat"
import ChatCard from "./ChatCard"
import { useAuthStore } from "@/stores/useAuthStore"
import { useChatStore } from "@/stores/useChatStore"
import { cn } from "@/lib/utils"

const DirectMessageCard = ({ conversation }: { conversation: Conversation }) => {
   const {user} = useAuthStore()
    const {activeConversationId, setActiveConversationId, messages} = useChatStore()
    if(!user) return null
    const otherUser = conversation.participants.find(participant => participant.userId !== user?._id) 
    const unreadCount = conversation.unreadCounts?.[user._id] || 0 
    const lastMessage = conversation.lastMessage?.content ?? ""
    const handleSelectConversation= async(id:string)=>{
        setActiveConversationId(id)
        if(!messages[id])

        
    }
    return (
        <ChatCard
        conversationId={conversation._id}
        name={otherUser?.displayName || "Unknown User"}
        timestamp={conversation.lastMessage?.createdAt ? new Date(conversation.lastMessage.createdAt).toISOString() : ""}
        isActive={activeConversationId === conversation._id}
        unreadCount={unreadCount}
        onSelectConversation={handleSelectConversation}
        leftSection={
            <>
            </>
            
        }
        subTitle={
            <p className={cn("text-sm truncate")}>{lastMessage}</p>
        }

    )
}

export default DirectMessageCard