import { useFriendStore } from "@/stores/useFriendStore"
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { MessageCircleMore } from "lucide-react"
import { Card } from "@/components/ui/card"
import UserAvatar from "@/components/chat/UserAvata"

const FriendlistModal = () => {
    const { friends } = useFriendStore()
    return (
        <DialogContent className="glass max-w-md">
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-xl capitalize">
                    <MessageCircleMore className="size-5" />
                    Bắt Đầu Hội Thoại Mới
                </DialogTitle>
            </DialogHeader>
            {friends.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-4 py-10">
                    <MessageCircleMore className="size-10 text-muted-foreground" />
                    <p className="text-center text-sm text-muted-foreground">
                        Bạn bị Tự Kỉ , không chơi với ai 
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    <h1 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                        Danh Sách Bạn bè
                    </h1>
                    <div>
                        {friends.map((friend) => (
                            <Card key={friend._id} className="group/friendCard cursor-pointer p-3 transition-colors hover:bg-muted/50">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <UserAvatar
                                            type="sidebar"
                                            name={friend.displayName || friend.username}
                                            imageUrl={friend.avatarUrl}
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium">{friend.displayName || friend.username}</span>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </DialogContent>
    )
}

export default FriendlistModal
