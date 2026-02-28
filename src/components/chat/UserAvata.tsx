import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
interface userAvataProps {
    type: "sidebar" | "chat" | "profile";
    name: string;
    imageUrl?: string;
    className?: string;
}
const UserAvatar = ({ type, name, imageUrl, className }: userAvataProps) => {
    const backgroundColors = !imageUrl ? "bg-blue-500" : ""
    if (!name) {
        return <div>Unknown User</div>
    }
    return (
        <Avatar className={cn(className ?? "",
            type === "sidebar" && "size-10",
            type === "chat" && "size-8",
            type === "profile" && "size-12 text-2xl shadow-md",
            backgroundColors
        )}>
            <AvatarImage src={imageUrl} alt={name}></AvatarImage>
            <AvatarFallback className={`${backgroundColors} text-white font-semibold`}>{name.charAt(0).toUpperCase()}</AvatarFallback>

        </Avatar>
    )
}

export default UserAvatar
