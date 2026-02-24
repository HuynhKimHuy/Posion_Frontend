import { useChatStore } from "@/stores/useChatStore"

import DirectMessageCard from "./DirectMessageCard"

const DirectMessageList = () => {
    const { conversations } = useChatStore()
    
    const directMessages = conversations.filter((conv) => conv.type === "direct")
    console.log(directMessages);
    
    return (
        <div className="flex-1 overflow-y-auto px-2 space-y-2">
        {directMessages.map((conv)=>(
            <DirectMessageCard key={conv._id} conversation={conv} />
        ))}
        </div>
    )
}

export default DirectMessageList