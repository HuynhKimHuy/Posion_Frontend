import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import type { Participant } from "@/types/chat"

interface GroupchatAvatarProps {
    participants: Participant[]
    type: "sidebar" | "chat" | "profile"
    className?: string
}

const GroupchatAvatar = ({ participants, type, className }: GroupchatAvatarProps) => {
    const visibleParticipants = participants.slice(0, 3)
    const hiddenCount = Math.max(participants.length - visibleParticipants.length, 0)

    const avatarSizeClass = cn(
        type === "sidebar" && "size-8",
        type === "chat" && "size-7",
        type === "profile" && "size-10"
    )

    return (
        <div className={cn("flex items-center", className)}>
            {visibleParticipants.map((participant, index) => {
                const displayName = participant.displayName || participant.userName || "U"

                return (
                    <Avatar
                        key={participant.userId}
                        className={cn(
                            avatarSizeClass,
                            "-ml-2 first:ml-0 border-2 border-background"
                        )}
                        style={{ zIndex: visibleParticipants.length - index }}
                    >
                        <AvatarImage src={participant.avatarUrl || undefined} alt={displayName} />
                        <AvatarFallback className="font-semibold">
                            {displayName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                )
            })}
            {hiddenCount > 0 && (
                <Avatar className={cn(avatarSizeClass, "-ml-2 border-2 border-background") }>
                    <AvatarFallback className="font-semibold">+{hiddenCount}</AvatarFallback>
                </Avatar>
            )}
        </div>
    )
}

export default GroupchatAvatar
