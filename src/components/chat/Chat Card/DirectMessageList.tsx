import { useChatStore } from "@/stores/useChatStore"

import DirectMessageCard from "./DirectMessageCard"
import { useEffect } from "react"

const DirectMessageList = () => {

    const { conversations, loadConversations, } = useChatStore()
    useEffect(()=>{
        loadConversations()
    }, [loadConversations])
    const directMessages = conversations.filter((conv) => conv.type === "direct")
    console.log(directMessages);

    return (
        <div className="flex-1 overflow-y-auto px-1 space-y-2 py-2">
            {directMessages.map((conv) => (
                <DirectMessageCard key={conv._id} conversation={conv} />
            ))}
        </div>
    )
}

export default DirectMessageList