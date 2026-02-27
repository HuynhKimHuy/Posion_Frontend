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
            className={cn("border-none p-3 cursor-pointer transition-smooth glass hover:bg-muted/30",
                isActive && "ring-2 ring-primary/50 bg-gradient-to-tr from-primary-glow/10 to-primary-foreground"
            )}
            onClick={() => onSelectConversation(conversationId)}
        >
            <div className="flex items-center gap-3">
                <div className="relative">
                    {leftSection}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">

                        <h3 className={cn("font-semibold truncate", unreadCount && unreadCount > 0 && "text-foreground")}>{name}</h3>
                        <span className="text-xs text-muted-foreground">
                            {timestamp ? formatMessageTime(new Date(timestamp)) : ""}
                        </span>
                    </div>

                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1 flex-1 min-w-0">{subTitle}</div>

                        <MoreHorizontal className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 hover:size-5 transition-smooth">
                        </MoreHorizontal>
                    </div>
                </div>
            </div>
        </Card>
    )
}

export default ChatCard