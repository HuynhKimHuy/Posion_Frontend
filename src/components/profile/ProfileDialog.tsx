import { Dialog, DialogContent } from "@/components/ui/dialog"
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
            <DialogContent className="overflow-y-auto border-0 bg-transparent p-0 shadow-2xl">
                <div className="bg-gradient-glass">
                    <div className="mx-auto max-w-4xl p-4">
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-foreground">Profile & Settings</h1>
                        </div>
                        <ProfileCard user={user} />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
export default ProfileDialog