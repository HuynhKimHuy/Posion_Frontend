import { useChatStore } from "@/stores/useChatStore";
import GroupMessageCard from "./GroupMessageCard";
const GroupChatList = () => {

    const { conversations } = useChatStore()
    const groupChatsList = conversations.filter((conv) => conv.type === "group")

    return (
        <div className="py-2 px-1 space-y-2">
            {groupChatsList.map((convo) => (
                <GroupMessageCard key={convo._id} conversation={convo} />
            ))}
        </div>
    )
}

export default GroupChatList