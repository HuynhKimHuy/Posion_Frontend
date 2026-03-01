import { useChatStore } from "@/stores/useChatStore"
import ChatWellcome from "./ChatWellcome"
import ChatWindowFooter from "./ChatWindowFooter"
import { SidebarInset } from "../ui/sidebar"
import ChatWindowHeader from "./ChatWindowHeader"
import ChatWindowBody from "./ChatWindowBody"



const ChatWindowLayout = () => {
    const {activeConversationId,
        conversations,
        messages,
        messagesLoading:loading,

    } = useChatStore()
    const selectedConversation = conversations.find(c => c._id === activeConversationId) ?? null
    if(!selectedConversation){
        return <ChatWellcome/>
    }
    if(loading || !messages[selectedConversation._id]){
        // return <ChatWindowSkeleton/>
    }
    return (
        <SidebarInset className="flex flex-col h-full flex-1 overflow-hidden rounded-sm shadow-md">
           {/* <ChatWindowHeader/> */}
           <ChatWindowHeader chat={selectedConversation}/>       
           {/* <ChatWindowBody/> */}
                     <div className="flex-1 min-h-0 overflow-hidden">
                         <ChatWindowBody/>
                     </div>
              {/* <ChatWindowFooter/> */}
            <ChatWindowFooter />
        </SidebarInset>
    )
}

export default ChatWindowLayout
