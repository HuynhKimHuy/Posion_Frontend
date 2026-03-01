import { useChatStore } from "@/stores/useChatStore";
import ConversationCard from "./ConversationCard";
const GroupChatList = () => {

    const { conversations } = useChatStore()
    const groupChatsList = conversations.filter((conv) => conv.type === "group")

    return (
        <div className="py-2 px-1 space-y-2">
            {groupChatsList.map((convo) => (
                <ConversationCard key={convo._id} conversation={convo} />
            ))}
        </div>
    )
}

export default GroupChatList