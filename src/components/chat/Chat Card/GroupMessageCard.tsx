import type { Conversation } from "@/types/chat"
import { useAuthStore } from "@/stores/useAuthStore"
import { useChatStore } from "@/stores/useChatStore"
import { cn } from "@/lib/utils"
import ChatCard from "./ChatCard"
import UserAvatar from "../UserAvata"
import StatusBadge from "../StatusBadge"
import UnreadCountBadge from "./UnreadBadge"

const GroupMessageCard = ({ conversation }: { conversation: Conversation }) => {
    const user = useAuthStore((state) => state.user)
    const { activeConversationId, setActiveConversation, messages } = useChatStore()

    if (!user) return null

    const unreadCount = conversation.unreadCounts?.[user._id] || 0
    const name = conversation.name || "Unnamed Group"
    const lastMessage = conversation.lastMessage?.content ?? ""

    const handleSelectConversation = async (id: string) => {
        setActiveConversation(id)
        // Load messages if not already loaded
        if (!messages[id]) {
            // TODO: fetch messages for this conversation
        }
    }

    return (
        <ChatCard
            conversationId={conversation._id}
            name={name}
            timestamp={conversation.lastMessage?.createdAt ? new Date(conversation.lastMessage.createdAt).toISOString() : ""}
            isActive={activeConversationId === conversation._id}
            unreadCount={unreadCount}
            onSelectConversation={handleSelectConversation}
            leftSection={
                <div className="flex items-center gap-3 relative">
                    <UserAvatar type="sidebar" name={name} />
                    <StatusBadge status="offline" />
                    {unreadCount > 0 && <UnreadCountBadge UnreadCount={unreadCount} />}
                </div>
            }
            subTitle={
                <p className={cn("text-sm truncate", unreadCount > 0 ? "font-semibold text-foreground" : "text-muted-foreground")}>
                    {lastMessage || `${conversation.participants.length} Thành viên`}
                </p>
            }
        />
    )
}

export default GroupMessageCard