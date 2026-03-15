import { useChatStore } from "@/stores/useChatStore"
import MessageInput from "./MessageInput"

const ChatWindowFooter = () => {
    const { activeConversationId, conversations } = useChatStore()
    const selectedConversation = conversations.find((conversation) => conversation._id === activeConversationId) ?? null
    return (
        <div className="sticky bottom-0 z-30 flex h-19 w-full shrink-0 items-center justify-between border-t border-border/70 bg-background/90 px-4 backdrop-blur-md">
            <MessageInput selectedConversation={selectedConversation} />
        </div>
    )
}

export default ChatWindowFooter