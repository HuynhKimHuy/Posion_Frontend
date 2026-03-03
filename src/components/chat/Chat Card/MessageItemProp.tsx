import { cn, formatMessageTime } from "@/lib/utils"
import type { Conversation, Message } from "@/types/chat"
import UserAvatar from "../UserAvata"
import { Card } from "@/components/ui/card"

interface MessageItemProps {
    message: Message
    index: number
    messages: Message[]
    selectedConvo: Conversation
    lastMessageStatus: "seen" | "delivered" | "sent"

}

const MessageItem = ({ message, index, messages, selectedConvo, lastMessageStatus }: MessageItemProps) => {
    const prev = messages[index - 1]
    const isGroupBreak = index === 0 || !prev || prev.senderId !== message.senderId || new Date(message.createdAt).getTime() - new Date(prev.createdAt).getTime() > 5 * 60 * 1000

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
                <p className="text-sm loading-relaxed break-words">{message.content}</p>
            </Card>

            {/**  status */}
            {isGroupBreak &&  (
            <span className="text-xs text-muted-foreground px-1">
             {formatMessageTime(new Date(message.createdAt))}
            </span>)}

            {/**  send delivered  */}
            {message.isOwn && message._id === selectedConvo.lastMessage?._id && (
                <span className="text-xs text-muted-foreground px-1">
                    {lastMessageStatus === "seen" ? "Đã xem" : lastMessageStatus === "delivered" ? "Đã gửi" : "Đang gửi..."}
                </span>
            )}

            
        </div>
    
    </div> )
}

export default MessageItem