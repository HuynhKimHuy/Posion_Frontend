import type { Conversation } from "@/types/chat"
import { useAuthStore } from "@/stores/useAuthStore"


const GroupMessageCard = ({ conversation }: { conversation: Conversation }) => {
    const user = useAuthStore((state) => state.user)

    const otherParticipant = conversation.participants.find(
        (participant) => participant.userId !== user?._id
    )

    const displayName =
        conversation.name?.trim() ||
        otherParticipant?.displayName ||
        otherParticipant?.userName ||
        "Unknown"

    return (
        <div className="flex items-center gap-2 p-2 rounded-md hover:bg-secondary cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-white">
                {displayName.charAt(0).toUpperCase()}
            </div>
            <span className="truncate">{displayName}</span>
        </div>
    )
}

export default GroupMessageCard