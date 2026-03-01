import type { Conversation, Message } from "@/types/chat"

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
    return ( <>
    </> )
}

export default MessageItem