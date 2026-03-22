import api from "@/lib/axios";
import type { FriendRequest, User } from "@/types/user";

type ApiRequestUser = {
    _id?: string;
    userName?: string;
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
};

type ApiFriendRequest = {
    _id?: string;
    from?: ApiRequestUser;
    to?: ApiRequestUser;
    createdAt?: string;
    message?: string;
};

type FriendListItem = Pick<User, "_id" | "userName" | "avatarUrl">;

const mapToFriendListItem = (user: ApiRequestUser): FriendListItem => ({
    _id: user._id ?? "",
    userName: user.userName ?? "",
    avatarUrl: user.avatarUrl,
});

const mapToFriendRequest = (request: ApiFriendRequest, user?: ApiRequestUser): FriendRequest => {
    const firstName = user?.firstName?.trim() ?? "";
    const lastName = user?.lastName?.trim() ?? "";
    const displayName = `${firstName} ${lastName}`.trim();

    return {
        id: request._id ?? "",
        userId: user?._id,
        username: user?.userName ?? "",
        displayName: displayName || user?.userName || "",
        avatarUrl: user?.avatarUrl,
        createdAt: request.createdAt,
        message: request.message,
    };
};

export const friendService = {

    async SearchByUserName(query: string): Promise<User | null> {
        const response = await api.get("/friends/search", {
            params: { username: query },
        });

        const users = Array.isArray(response.data?.metadata)
            ? (response.data.metadata as User[])
            : [];

        if (!users.length) return null;

        const normalizedQuery = query.trim().toLowerCase();
        const exactMatch = users.find(
            (user) => user?.userName?.toLowerCase() === normalizedQuery
        );

        return exactMatch ?? users[0] ?? null;
    },

    async sendFriendRequest(to: string, message: string) {
        const response = await api.post(`/friends/request`, { to, message });
        return response.data.message;
    },

    async getAllFriendsRequest(): Promise<{ sent: FriendRequest[]; received: FriendRequest[] }> {
        const res = await api.get("/friends/requests");
        const metadata = res.data?.metadata ?? {};

        const sent = Array.isArray(metadata.sent)
            ? (metadata.sent as ApiFriendRequest[]).map((request) => mapToFriendRequest(request, request.to))
            : [];

        const received = Array.isArray(metadata.received)
            ? (metadata.received as ApiFriendRequest[]).map((request) => mapToFriendRequest(request, request.from))
            : [];

        return { sent, received };
    },

    async acceptFriendRequest(requestId: string): Promise<User> {
        const res = await api.post(`/friends/requests/${requestId}/accept`);
        return res.data.metadata.newFriend;
    },
    async declineFriendRequest(requestId: string): Promise<string> {
        const res = await api.post(`/friends/requests/${requestId}/decline`);
        return res.data.message;
    },
    async getFriendsList(): Promise<FriendListItem[]> {
        const res = await api.get("/friends");
        return Array.isArray(res.data?.metadata)
            ? (res.data.metadata as ApiRequestUser[]).map(mapToFriendListItem)
            : [];
    },

};