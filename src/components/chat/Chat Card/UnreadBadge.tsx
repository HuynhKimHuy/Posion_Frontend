import { Badge } from "lucide-react"

const UnreadCountBadge = ({ UnreadCount }: { UnreadCount: number }) => {
    return (
        <div className='pulse-ring absolute z-20 -top-1 -right-1'>
            <Badge className=" size-5 text-xs bg-gradient-chat border-background">
                {UnreadCount > 9 ? "9+" : UnreadCount}
            </Badge>
        </div>
    )
}

export default UnreadCountBadge
