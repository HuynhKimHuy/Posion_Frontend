import { friendService } from "@/service/friendSevervice";
import type { friendState } from "@/types/store";
import { create } from "zustand";


export const useFriendStore = create<friendState>((set,get) => ({
    loading: false,
    searchByUserName:async(username)=>{
        try {
            set({loading:true})
            const user = await friendService.SearchByUserName(username)
            return user 
        } catch (error) {
            set({loading:false})
            console.error("Error searching user:", error);
            return null
            
        } finally{
            set({loading:false})
        }
    },
    sendFriendRequest:async(to, message?)=>{
        try{
            set({loading:true})
            const resultMessageRequest = await friendService.sendFriendRequest(to, message)
            return resultMessageRequest
        }catch(error){
            set({loading:false})
            console.error("Error sending friend request:", error);
            throw error
        } finally{
            set({loading:false})
        }

    }
}))