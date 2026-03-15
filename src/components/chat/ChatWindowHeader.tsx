import { useChatStore } from "@/stores/useChatStore"
import type { Conversation } from "@/types/chat"
import { SidebarTrigger } from "../ui/sidebar"
import { useAuthStore } from "@/stores/useAuthStore"
import { Separator } from "../ui/separator"
import UserAvatar from "./UserAvata"
import StatusBage from "./StatusBadge"
import GroupchatAvatar from "./GroupchatAvatar"
import { useSocketStore } from "@/stores/socketStore"

const ChatWindowHeader = ({ chat }: { chat?: Conversation }) => {
    const { conversations, activeConversationId } = useChatStore()
    chat = chat ?? conversations.find(c => c._id === activeConversationId) ?? undefined
    const { onlineUsers } = useSocketStore()
    let otherUser
    if (!chat) {
        return (
            <header className="md:hidden sticky top-0 z-30 flex shrink-0 items-center gap-2 px-4 py-2 w-full border-b border-border/70 bg-background/85 backdrop-blur-md">
                <SidebarTrigger className="-ml-1 text-foreground" />
            </header>
        )
    }
    if (chat.type === "direct") {
        const otherUsers = chat.participants.filter(p => p.userId !== useAuthStore.getState().user?._id)
        otherUser = otherUsers.length > 0 ? otherUsers[0] : null
    }

    const title = chat.type === "direct"
        ? (otherUser?.displayName || "Unknown User")
        : (chat.name || "Unnamed Group")

    const subTitle = chat.type === "direct"
        ? (onlineUsers.includes(otherUser?.userId || "") ? "Đang hoạt động" : "Ngoại tuyến")
        : `${chat.participants.length} thành viên`

    return (
        <header className="sticky top-0 z-30 flex h-18 w-full shrink-0 items-center justify-between border-b border-border/70 bg-background/92 px-4 py-2">
            <div className="flex items-center gap-2 w-full min-w-0">
                <SidebarTrigger className="-ml-1 text-foreground " />
                <Separator
                    orientation="vertical"
                    className=" mr-2 data-[orientation=vertical]:h-4 " />
                <div className="w-full min-w-0 flex items-center gap-3">
                    {/*avatar */}
                    <div className="relative">
                        {
                            chat.type === "direct" ? (<>
                                <UserAvatar type={"sidebar"}
                                    name={otherUser?.displayName || "Unknown User"}
                                    imageUrl={otherUser?.avatarUrl || undefined}
                                    className=""
                                />
                                <StatusBage status={onlineUsers.includes(otherUser?.userId || "") ? "online" : "offline"} />
                            </>) :
                                <GroupchatAvatar
                                    participants={chat.participants}
                                    type={"sidebar"}
                                />
                        }

                    </div>
                    {/*name */}
                    <div className="min-w-0">
                        <h2 className="truncate text-[15px] font-semibold leading-tight text-foreground">{title}</h2>
                        <p className="truncate text-xs leading-tight text-muted-foreground">{subTitle}</p>
                    </div>

                </div>
            </div>
        </header>
    )
}

export default ChatWindowHeader