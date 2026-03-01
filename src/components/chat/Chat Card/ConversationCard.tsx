import { cn } from "@/lib/utils"
import { useAuthStore } from "@/stores/useAuthStore"
import { useChatStore } from "@/stores/useChatStore"
import type { Conversation } from "@/types/chat"
import GroupchatAvatar from "../GroupchatAvatar"
import StatusBage from "../StatusBadge"
import UserAvatar from "../UserAvata"
import ChatCard from "./ChatCard"
import UnreadCountBadge from "./UnreadBadge"

interface ConversationCardProps {
    conversation: Conversation
}

const ConversationCard = ({ conversation }: ConversationCardProps) => {
    const user = useAuthStore((state) => state.user)
    const { activeConversationId, setActiveConversation, messages } = useChatStore()

    if (!user) return null

    const unreadCount = conversation.unreadCounts?.[user._id] || 0
    const isDirect = conversation.type === "direct"
    const otherUser = isDirect
        ? conversation.participants.find((participant) => participant.userId !== user._id)
        : null

    const displayName = isDirect
        ? otherUser?.displayName || otherUser?.userName || "Unknown User"
        : conversation.name || conversation.group?.name || "Unnamed Group"

    const lastMessage = conversation.lastMessage?.content ?? ""

    const handleSelectConversation = async (id: string) => {
        if (activeConversationId === id) {
            setActiveConversation(null)
            return
        }

        setActiveConversation(id)
        if (!messages[id]) {
            await useChatStore.getState().fetchMessages(id)
        }
    }

    return (
        <ChatCard
            conversationId={conversation._id}
            name={displayName}
            timestamp={conversation.lastMessage?.createdAt ? new Date(conversation.lastMessage.createdAt).toISOString() : ""}
            isActive={activeConversationId === conversation._id}
            unreadCount={unreadCount}
            onSelectConversation={handleSelectConversation}
            leftSection={
                <div className="flex items-center gap-3 relative">
                    {isDirect ? (
                        <>
                            <UserAvatar
                                type="sidebar"
                                name={displayName}
                                imageUrl={otherUser?.avatarUrl || undefined}
                            />
                            <StatusBage status="offline" />
                        </>
                    ) : (
                        <GroupchatAvatar participants={conversation.participants} type="sidebar" />
                    )}
                    {unreadCount > 0 && <UnreadCountBadge UnreadCount={unreadCount} />}
                </div>
            }
            subTitle={
                <p className={cn("text-sm truncate", unreadCount > 0 ? "font-semibold text-foreground" : "text-muted-foreground")}>
                    {lastMessage || (isDirect ? "Chưa có tin nhắn" : `${conversation.participants.length} thành viên`)}
                </p>
            }
        />
    )
}

export default ConversationCard
