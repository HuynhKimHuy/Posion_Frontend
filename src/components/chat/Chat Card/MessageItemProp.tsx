import { cn, formatMessageTime } from "@/lib/utils"
import type { Conversation, Message } from "@/types/chat"
import UserAvatar from "../UserAvata"
import { Card } from "@/components/ui/card"

interface MessageItemProps {
    message: Message
    index: number
    messages: Message[]
    selectedConvo: Conversation
    lastMessageStatus: "seen" | "read" | "delivered"
    lastOwnMessageId?: string

}

const MessageItem = ({ message, index, messages, selectedConvo, lastMessageStatus, lastOwnMessageId,  }: MessageItemProps) => {
    const prev = messages[index - 1]
    const isGroupBreak = index === 0 || !prev || prev.senderId !== message.senderId || new Date(message.createdAt).getTime() - new Date(prev.createdAt).getTime() > 5 * 60 * 1000
    const seenByOthers = (selectedConvo.seenBy || []).filter((user) => user._id !== message.senderId)
    const seenNames = seenByOthers.map((user) => user.displayName || user.userName).filter(Boolean)

    const getStatusText = () => {
        if (lastMessageStatus === "seen") {
            if (selectedConvo.type === "group" && seenNames.length > 0) {
                return `Đã xem bởi ${seenNames.join(", ")}`
            }
            return "Đã xem"
        }

        if (lastMessageStatus === "read") {
            return "Đã đọc"
        }

        return "Đã nhận"
    }

    const participant = selectedConvo.participants.find(p => p.userId === message.senderId)
    return (
    <div className={cn("flex gap-2 message-bound",
        message.isOwn ? "justify-end" : "justify-start",
    )}>
        {/** avatar */}
        {!message.isOwn && (
            <div className="w-8">
                {isGroupBreak && (<>
                    <UserAvatar
                    type="chat"
                    name={participant?.displayName || "Unknown"}
                    imageUrl={participant?.avatarUrl || undefined}
                    />
                </>)}
            </div>
        )}



        {/** tin nhan */}
        <div className={cn(
            "max-w-xs md:max-w-md lg:max-w-lg space-y-1 flex flex-col",
            message.isOwn ? "items-end" : "items-start",
        )}>
            <Card className={cn("p-2", message.isOwn ? "chat-bubble-sent" : "chat-bubble-received")}> 
                <p className="text-sm loading-relaxed wrap-break-word">{message.content}</p>
            </Card>

            {/**  status */}
            {isGroupBreak &&  (
            <span className="text-xs text-muted-foreground px-1">
             {formatMessageTime(new Date(message.createdAt))}
            </span>)}

            {/**  send delivered  */}
            {message.isOwn && message._id === lastOwnMessageId && (
                <span className="text-xs text-muted-foreground px-1">
                    {getStatusText()}
                </span>
            )}

            
        </div>
    
    </div> )
}

export default MessageItem