import { useState  } from "react";
import { useForm } from "react-hook-form";
import {Dialog, DialogTrigger , DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import type { User } from "@/types/user";
import { useFriendStore } from "@/stores/useFriendStore";
import SearchForm from "./AddFriendModal/SearchFormModal";
import SendFriendRequest from "./AddFriendModal/SendFriendRequest";


export interface AddFriendModalProps {
    username: string;
    message: string;
}

const AddFriendModal = () => {
    const [isFound, setIsFound] = useState<boolean | null>(null);
    const [searchUser,setSearchUser] = useState<User | null>(null);
    const [searchUserName, setSearchUserName] = useState<string>("");
    const [alreadySent, setAlreadySent] = useState<boolean>(false);
    const { loading , searchByUserName , sendFriendRequest, getAllFriendsRequest } = useFriendStore();
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
                await getAllFriendsRequest();
                const sentRequests = useFriendStore.getState().sentRequests;
                const isAlreadySent = sentRequests.some((request) =>
                    request.userId
                        ? request.userId === user._id
                        : request.username.toLowerCase() === user.userName.toLowerCase()
                );

                setAlreadySent(isAlreadySent);
                setIsFound(true);
                setSearchUser(user);
                setSearchUserName(userName);
            } else {
                setIsFound(false);
                setSearchUser(null);
                setAlreadySent(false);
            }
        } catch(error) {
            console.error("Error searching for user:", error);
            setIsFound(false);
            setSearchUser(null);
            setAlreadySent(false);
        }
     }
    );
    
    const handleSendRequest = handleSubmit(async (data) => {
        if(!searchUser?._id) {
            toast.error("User not found. Please search again.");
            return;
        }
        const message = data.message.trim();
        if (!message) {
            toast.error("Please enter a friend request message.");
            return;
        }
        if (alreadySent) {
            toast.info("You already sent a friend request to this user.");
            return;
        }
        try {
             const responseMessage = await sendFriendRequest(searchUser._id, message);
             setAlreadySent(true);
             toast.success(responseMessage);
            handleReset();
        } catch(error) {
            console.error("Error sending friend request:", error);
            if (axios.isAxiosError(error)) {
                const serverMessage = error.response?.data?.message;
                toast.error(serverMessage || "Failed to send friend request.");
            } else {
                toast.error("Failed to send friend request.");
            }
        }
    });

    const handleReset = () => {
        reset();
        setIsFound(null);
        setSearchUser(null);
        setSearchUserName("");
        setAlreadySent(false);
    }

    const handleBackToSearch = () => {
        setIsFound(false);
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
                        loading={loading}
                        register={register}
                        errors={errors}
                        watch={watch}
                        foundUser={searchUser}
                        alreadySent={alreadySent}
                        onSubmit={handleSendRequest}
                        onBack={handleBackToSearch}
                    />

                </>}
            </DialogContent>
        </Dialog>
    );
};

export default AddFriendModal;
