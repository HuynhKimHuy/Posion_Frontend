import { cn } from '@/lib/utils'


const StatusBage = ({ status }: { status: "online" | "offline" }) => {

    return (
        <div className={cn(
            "absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-background", 
            status === "online" && "bg-green-500",
            status === "offline" && "bg-gray-400" 
        )}>

        </div>
    )
}

export default StatusBage
