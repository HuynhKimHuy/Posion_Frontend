import { useState } from "react";
import {Dialog, DialogTrigger , DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { UserPlus } from "lucide-react";

export interface AddFriendModalProps {
    username: string;
    message?: string;
}

const AddFriendModal = () => {
    const [isFound, setIsFound] = useState<boolean | null>(null);

    return (
        <Dialog >
            <DialogTrigger asChild>
                <div className="flex justify-center items-center size-5 rounded-full hover:bg-sidebar-accent cursor-pointer z-10">
                    <UserPlus size={18} />
                    <span className="sr-only">Add Friend</span>
                </div>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="font-semibold">Add Friend</DialogTitle>
                </DialogHeader>
                {!isFound && <p>User not found.</p>}
                {isFound && <p>User found! You can send a friend request.</p>}
            </DialogContent>
        </Dialog>
    );
};

export default AddFriendModal;
