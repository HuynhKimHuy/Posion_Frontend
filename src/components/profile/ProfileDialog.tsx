import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import ProfileCard from "./ProfileCard";
import { useAuthStore } from "@/stores/useAuthStore";

interface ProfileDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}
const ProfileDialog = ({ open, setOpen }: ProfileDialogProps) => {
    const user = useAuthStore((state) => state.user)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent
                className="top-0 left-0 h-dvh w-screen max-w-none translate-x-0 translate-y-0 overflow-hidden rounded-none border-0 bg-transparent p-0 shadow-none"
            >
                <DialogHeader className="sr-only">
                    <DialogTitle>Profile & Settings</DialogTitle>
                </DialogHeader>
                <div className="beautiful-scrollbar h-full overflow-y-auto bg-gradient-glass">
                    <div className="mx-auto w-full max-w-5xl px-3 py-4 sm:px-4 md:px-6 md:py-6">
                        <div className="mb-6">
                            <h1 className="text-xl font-bold text-foreground sm:text-2xl">Profile & Settings</h1>
                        </div>
                        <ProfileCard user={user} />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
export default ProfileDialog