import { MoreHorizontal } from "lucide-react";
import { Card } from "../../ui/card"
import { cn, formatMessageTime } from "@/lib/utils";

interface ChatCardProps {
    conversationId: string;
    name: string;
    timestamp: string;
    isActive: boolean;
    onSelectConversation: (id: string) => void;
    unreadCount?: number;
    leftSection?: React.ReactNode;
    subTitle: React.ReactNode
}
const ChatCard = ({ conversationId, name, timestamp, isActive, onSelectConversation, unreadCount, leftSection, subTitle }: ChatCardProps) => {
    return (
        <Card key={conversationId}
            className={cn("group cursor-pointer border border-transparent px-3.5 py-3 transition-smooth glass hover:border-primary/15 hover:bg-muted/40",
                isActive && "border-primary/25 bg-muted/55"
            )}
            onClick={() => onSelectConversation(conversationId)}
        >
            <div className="flex items-center gap-3">
                <div className="relative">
                    {leftSection}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="mb-1.5 flex items-center justify-between">

                        <h3 className={cn("truncate text-sm font-semibold leading-tight", unreadCount && unreadCount > 0 && "text-foreground")}>{name}</h3>
                        <span className="text-[11px] text-muted-foreground">
                            {timestamp ? formatMessageTime(new Date(timestamp)) : ""}
                        </span>
                    </div>

                    <div className="mb-0.5 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1 flex-1 min-w-0">{subTitle}</div>

                        <MoreHorizontal className="size-4 text-muted-foreground opacity-0 transition-smooth group-hover:opacity-100">
                        </MoreHorizontal>
                    </div>
                </div>
            </div>
        </Card>
    )
}

export default ChatCard