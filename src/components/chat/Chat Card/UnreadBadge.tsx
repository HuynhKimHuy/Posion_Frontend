import { Badge } from "@/components/ui/badge"

const UnreadCountBadge = ({ unreadCount }: { unreadCount: number }) => {
    const displayCount = unreadCount > 99 ? "99+" : unreadCount

    return (
        <div className="absolute -right-1 -top-1 z-20">
            <Badge
                variant="destructive"
                className="relative h-5 min-w-5 rounded-full border border-background bg-red-600 px-1.5 text-[10px] font-semibold tracking-tight text-white shadow-sm"
                aria-label={`${unreadCount} unread messages`}
            >
                {displayCount}
            </Badge>
        </div>
    )
}

export default UnreadCountBadge
