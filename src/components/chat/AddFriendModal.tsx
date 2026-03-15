import { useState  } from "react";
import { useForm } from "react-hook-form";
import {Dialog, DialogTrigger , DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";
import type { User } from "@/types/user";
import { useFriendStore } from "@/stores/useFriendStore";
import SearchForm from "./AddFriendModal/SearchFormModal";
import SendFriendRequest from "./AddFriendModal/SendFriendRequest";


export interface AddFriendModalProps {
    username: string;
    message?: string;
}

const AddFriendModal = () => {
    const [isFound, setIsFound] = useState<boolean | null>(null);
    const [searchUser,setSearchUser] = useState<User | null>(null);
    const [searchUserName, setSearchUserName] = useState<string>("");
    const { loading , searchByUserName , sendFriendRequest } = useFriendStore();
    const {
        register,
        handleSubmit,
        watch,
        reset, formState: { errors },
    } = useForm<AddFriendModalProps>({
        defaultValues:{
            username: "",
            message: "",
        }
    });

    /**
     * Giá trị username hiện tại được theo dõi từ form.
     * Được sử dụng để cập nhật realtime khi người dùng gõ vào trường username.
     * @type {string}
     */
    const userNameValue = watch("username");

    const handleSearch = handleSubmit(async (data) => { 
        const  userName = data.username.trim(); 
        if(!userName) return 
        setIsFound(false);

        try{
            const user = await searchByUserName(userName);
            if(user){
                setIsFound(true);
                setSearchUser(user);
                setSearchUserName(userName);
            } else {
                setIsFound(false);
            }
        } catch(error) {
            console.error("Error searching for user:", error);
            setIsFound(false);
        }
     }
    );
    
    const handleSendRequest = handleSubmit(async (data) => {
        if(!searchUser) return;
        try {
             const message = await sendFriendRequest(searchUser._id, data.message);
             toast.success(message);
            handleReset();
        } catch(error) {
            console.error("Error sending friend request:", error);
            toast.error("Failed to send friend request.");
        }
    });

    const handleReset = () => {
        reset();
        setIsFound(null);
    }

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
                {!isFound && <>
                    <SearchForm
                        register={register}
                        errors={errors}
                        loading={loading}
                        userNameValue={userNameValue}
                        onSubmit={handleSearch}
                        isFound={isFound}
                        searchUserName={searchUserName}
                        onCancel={handleReset}
                    />
                    </>}
                {isFound && <>
                    <SendFriendRequest
                        register={register}
                        searchUserName={searchUserName}
                    />

                </>}
            </DialogContent>
        </Dialog>
    );
};

export default AddFriendModal;
