import { useChatStore } from "@/stores/useChatStore"
import type { Conversation } from "@/types/chat"
import { SidebarTrigger } from "../ui/sidebar"
import { useAuthStore } from "@/stores/useAuthStore"
import { Separator } from "../ui/separator"
import UserAvatar from "./UserAvata"
import StatusBage from "./StatusBadge"
import GroupchatAvatar from "./GroupchatAvatar"

const ChatWindowHeader = ({chat}:{chat?:Conversation }) => {
    const {conversations , activeConversationId} = useChatStore()
    chat = chat ?? conversations.find(c => c._id === activeConversationId) ?? undefined
    let otherUser
    if(!chat){
        return(
            <header className="md:hidden sticky top-0 z-10 flex items-center gap-2 px-4 py-2 w-full">
            <SidebarTrigger className="-ml-1 text-foreground"/>
         </header>
        )
    }
    if(chat.type === "direct"){
        const otherUsers = chat.participants.filter(p => p.userId !== useAuthStore.getState().user?._id)
        otherUser = otherUsers.length > 0 ? otherUsers[0] : null
    }
    return (
        <header className="flex top-10 z-10 px-4 py-2 h-16 w-full items-center justify-between bg-background ">   
            <div className="flex items-center gap-2 w-full"> 
                <SidebarTrigger className="-ml-1 text-foreground "/>
                <Separator 
                    orientation="vertical"
                     className=" mr-2 data-[orientation=vertical]:h-4 "/>
                <div className=" w-full flex items-center gap-3">
                    {/*avatar */}
                    <div className="relative">
                        {
                            chat.type==="direct" ? (<>
                            <UserAvatar type={"sidebar"}
                            name={otherUser?.displayName || "Unknown User"}
                            imageUrl={otherUser?.avatarUrl || undefined}
                            className=""
                            />
                            <StatusBage status="online"/>
                            </>) :
                            <GroupchatAvatar
                            participants={chat.participants}
                            type={"sidebar"}
                            />
                        }

                     </div>
                    {/*name */}
                    <h2 className="font-semibold text-foreground">
                        {
                            chat.type === "direct" ? (otherUser?.displayName || "Unknown User") : chat.name || "Unnamed Group"}
                    </h2>
                    
                 </div>
            </div>
        </header>
    )
}

export default ChatWindowHeader