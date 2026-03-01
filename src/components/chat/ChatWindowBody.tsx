import { useChatStore } from "@/stores/useChatStore"


const ChatWindowBody = () => {
    const {activeConversationId,
        messages: allMessages,
        } = useChatStore()
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

    return (
        <div className="px-4 py-4 bg-primary-forground h-full flex flex-col overflow-y-auto gap-4">   
             <div className="flex flex-col overflow-y-auto overflow-x-hidden beautiful-scrollbar gap-4">
                {messages.map((message) => (<div key={message._id} className="content">{message.content}</div>))}
             </div>
        </div>
    )
}

export default ChatWindowBody