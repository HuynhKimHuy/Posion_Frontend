import api from "@/lib/axios";

export const friendService = {

    async SearchByUserName(query: string) {
        const response = await api.get(`/friends/search?username=${query}`);
        return response.data.metadata;
    },

    async sendFriendRequest(to: string, message?: string) {
        const response = await api.post(`/friends/request`, { to, message });
        return response.data.message;
    },

}