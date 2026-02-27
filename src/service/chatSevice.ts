import api from "@/lib/axios";
import type { ConversationResponse } from "@/types/chat";

export const fetchConversations = async (): Promise<ConversationResponse> => {
    try {
        const res = await api.get("/conversation");
        console.log("✅ [chatService] Conversations fetched:", res.data);
        return res.data.metadata;
    } catch (error: any) {
        console.error("❌ [chatService] Error fetching conversations:", error.response?.status, error.response?.data);
        console.error("Full error:", error);
        throw error;
    }
}

