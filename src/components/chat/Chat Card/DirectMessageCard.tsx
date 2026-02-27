import type { Conversation } from "@/types/chat"
import ChatCard from "./ChatCard"
import { useAuthStore } from "@/stores/useAuthStore"
import { useChatStore } from "@/stores/useChatStore"
import { cn } from "@/lib/utils"
import UserAvatar from "../UserAvata"
import StatusBadge from "../StatusBadge"
import UnreadCountBadge from "./UnreadBadge"


const DirectMessageCard = ({ conversation }: { conversation: Conversation }) => {
    const { user } = useAuthStore()
    const { activeConversationId, setActiveConversation, messages } = useChatStore()
    if (!user) return null
    const otherUser = conversation.participants.find(participant => participant.userId !== user?._id)
    const unreadCount = conversation.unreadCounts?.[user._id] || 0
    const lastMessage = conversation.lastMessage?.content ?? ""

    const handleSelectConversation = async (id: string) => {
        setActiveConversation(id)
        // Load messages if not already loaded
        if (!messages[id]) {
            // TODO: Fetch messages for this conversation
        }
    }

    return (
        <ChatCard
            conversationId={conversation._id}
            name={otherUser?.displayName || otherUser?.userName || "Unknown User"}
            timestamp={conversation.lastMessage?.createdAt ? new Date(conversation.lastMessage.createdAt).toISOString() : ""}
            isActive={activeConversationId === conversation._id}
            unreadCount={unreadCount}
            leftSection={
                <div className="flex items-center gap-3 relative">
                    <UserAvatar type="sidebar" name={otherUser?.displayName || otherUser?.userName || ""} />
                    <StatusBadge status="offline" />
                    {unreadCount > 0 && <UnreadCountBadge UnreadCount={unreadCount} />}
                </div>
            }
            onSelectConversation={handleSelectConversation}
            subTitle={
                <p className={cn("text-sm truncate", unreadCount > 0 ? "font-semibold text-foreground" : "text-muted-foreground")}>{lastMessage}</p>
            }
        />
    )
}

export default DirectMessageCard