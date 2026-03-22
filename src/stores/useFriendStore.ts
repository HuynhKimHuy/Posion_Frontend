import { friendService } from "@/service/friendSevervice";
import type { friendState } from "@/types/store";
import type { Friend } from "@/types/user";
import { create } from "zustand";


export const useFriendStore = create<friendState>((set, get) => ({
    friends: [],
    loading: false,
    receivedRequests: [],
    sentRequests: [],

    searchByUserName: async (username) => {
        try {
            set({ loading: true })
            const user = await friendService.SearchByUserName(username)
            return user
        } catch (error) {
            set({ loading: false })
            console.error("Error searching user:", error);
            return null

        } finally {
            set({ loading: false })
        }
    },
    sendFriendRequest: async (to, message) => {
        try {
            set({ loading: true })
            const resultMessageRequest = await friendService.sendFriendRequest(to, message)
            return resultMessageRequest
        } catch (error) {
            set({ loading: false })
            console.error("Error sending friend request:", error);
            throw error
        } finally {
            set({ loading: false })
        }

    },
    getAllFriendsRequest: async () => {
        try {
            set({ loading: true });
            const requests = await friendService.getAllFriendsRequest();
            set({ receivedRequests: requests.received, sentRequests: requests.sent });
        } catch (error) {
            console.error("Error fetching friend requests:", error);
        } finally {
            set({ loading: false });
        }
    },
    acceptFriendRequest: async (requestId: string) => {
        try {
            set({ loading: true });
            const newFriend = await friendService.acceptFriendRequest(requestId);
            // Refresh received requests to remove accepted request
            await get().getAllFriendsRequest();
            return newFriend;
        } catch (error) {
            console.error("Error accepting friend request:", error);
            throw error;
        } finally {
            set({ loading: false });
        }
    },
    declineFriendRequest: async (requestId: string) => {
        try {
            set({ loading: true });
            const result = await friendService.declineFriendRequest(requestId);
            await get().getAllFriendsRequest();
            return result;
        } catch (error) {
            console.error("Error declining friend request:", error);
            throw error;
        } finally {
            set({ loading: false });
        }
    },
    getFriendList: async () => {
        try {
            set({ loading: true })
            const friendsList = await friendService.getFriendsList()
            const normalizedFriends: Friend[] = friendsList.map((friend) => ({
                _id: friend._id,
                username: friend.userName,
                displayName: friend.userName,
                avatarUrl: friend.avatarUrl,
            }));
            set({ friends: normalizedFriends })
        } catch (error) {
            console.error("Error fetching friend list:", error);
        } finally {
            set({ loading: false })
        }
    },
}))