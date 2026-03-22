
import { useFriendStore } from "@/stores/useFriendStore"
import { Card } from "@/components/ui/card"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import FriendlistModal from "@/components/chat/CreatedNewChat/FriendlistModal"
import { MessageCircle } from "lucide-react"
const CreatedNewChat = () => {
    const { getFriendList } = useFriendStore()
    const fetchFriends = async () => {
        await getFriendList()
    }

    return (
        <div className="flex gap-2">
            <Card className="group flex-1 p-2 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">

                <Dialog>
                    <DialogTrigger asChild>
                        <button
                            type="button"
                            className="flex h-full w-full items-center gap-3 rounded-lg px-3 py-1 text-left transition-colors hover:bg-muted/60"
                            onClick={fetchFriends}
                        >
                            <div className="flex size-9 items-center justify-center rounded-full bg-linear-to-tr from-primary to-secondary transition-transform duration-200 group-hover:scale-105">
                                <MessageCircle className="size-4 text-white" />
                            </div>
                            <span className="text-sm font-medium text-foreground">Gửi tin nhắn mới</span>
                        </button>
                    </DialogTrigger>
                    <FriendlistModal />
                </Dialog>
            </Card>
        </div>
    )
}

export default CreatedNewChat