import api from "@/lib/axios";
import type { ConversationResponse } from "@/types/chat";

export const fetchConversations = async (accessToken: string): Promise<ConversationResponse> => {
    const res = await api.get("/conversation", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return res.data.metadata;
}

