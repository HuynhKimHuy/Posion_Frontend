import { useEffect, useMemo, useState } from "react"
import axios from "axios"
import { toast } from "sonner"
import { UsersRound, Plus, Check } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { SidebarGroupAction } from "@/components/ui/sidebar"
import UserAvatar from "./UserAvata"
import { useFriendStore } from "@/stores/useFriendStore"
import { useChatStore } from "@/stores/useChatStore"

const NewGroupChatModal = () => {
    const [open, setOpen] = useState(false)
    const [groupName, setGroupName] = useState("")
    const [selectedFriendIds, setSelectedFriendIds] = useState<string[]>([])
    const [submitting, setSubmitting] = useState(false)

    const { friends, getFriendList } = useFriendStore()
    const { createConversation, fetchMessages, messages } = useChatStore()

    useEffect(() => {
        if (!open) return
        void getFriendList()
    }, [open, getFriendList])

    const selectedCount = selectedFriendIds.length
    const canSubmit = useMemo(
        () => groupName.trim().length > 0 && selectedCount >= 1 && !submitting,
        [groupName, selectedCount, submitting]
    )

    const resetForm = () => {
        setGroupName("")
        setSelectedFriendIds([])
        setSubmitting(false)
    }

    const handleOpenChange = (nextOpen: boolean) => {
        setOpen(nextOpen)
        if (!nextOpen) {
            resetForm()
        }
    }

    const handleToggleFriend = (friendId: string) => {
        setSelectedFriendIds((prev) =>
            prev.includes(friendId)
                ? prev.filter((id) => id !== friendId)
                : [...prev, friendId]
        )
    }

    const handleCreateGroup = async () => {
        if (!canSubmit) return

        try {
            setSubmitting(true)
            const conversation = await createConversation("group", groupName.trim(), selectedFriendIds)

            if (conversation?._id && !messages[conversation._id]) {
                await fetchMessages(conversation._id)
            }

            toast.success("Tao nhom chat thanh cong")
            handleOpenChange(false)
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || "Khong tao duoc nhom chat")
            } else {
                toast.error("Khong tao duoc nhom chat")
            }
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <SidebarGroupAction title="Tao Nhom" className="cursor-pointer" asChild>
                    <button type="button" aria-label="Tao nhom chat moi">
                        <Plus />
                    </button>
                </SidebarGroupAction>
            </DialogTrigger>

            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <UsersRound className="size-5" />
                        Tao Group Chat
                    </DialogTitle>
                    <DialogDescription>
                        Dat ten nhom va chon ban be de bat dau cuoc tro chuyen nhom.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="group-name" className="text-sm font-medium">Ten nhom</label>
                        <Input
                            id="group-name"
                            value={groupName}
                            onChange={(event) => setGroupName(event.target.value)}
                            maxLength={80}
                            placeholder="Vi du: Team Product"
                        />
                        <p className="text-xs text-muted-foreground">Can chon it nhat 1 ban be.</p>
                    </div>

                    <div className="space-y-2">
                        <p className="text-sm font-medium">Ban be ({selectedCount} da chon)</p>
                        <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
                            {friends.length === 0 ? (
                                <p className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
                                    Chua co ban be de tao nhom.
                                </p>
                            ) : (
                                friends.map((friend) => {
                                    const isSelected = selectedFriendIds.includes(friend._id)

                                    return (
                                        <button
                                            key={friend._id}
                                            type="button"
                                            className="w-full text-left"
                                            onClick={() => handleToggleFriend(friend._id)}
                                        >
                                            <Card className={`p-3 transition-colors ${isSelected ? "border-primary bg-primary/5" : "hover:bg-muted/50"}`}>
                                                <div className="flex items-center justify-between gap-3">
                                                    <div className="flex min-w-0 items-center gap-3">
                                                        <UserAvatar
                                                            type="sidebar"
                                                            name={friend.displayName || friend.username}
                                                            imageUrl={friend.avatarUrl}
                                                        />
                                                        <div className="min-w-0">
                                                            <p className="truncate text-sm font-medium">{friend.displayName || friend.username}</p>
                                                            <p className="truncate text-xs text-muted-foreground">@{friend.username}</p>
                                                        </div>
                                                    </div>
                                                    {isSelected ? <Check className="size-4 text-primary" /> : null}
                                                </div>
                                            </Card>
                                        </button>
                                    )
                                })
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={submitting}>
                            Huy
                        </Button>
                        <Button type="button" onClick={() => void handleCreateGroup()} disabled={!canSubmit}>
                            {submitting ? "Dang tao..." : "Tao nhom"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default NewGroupChatModal