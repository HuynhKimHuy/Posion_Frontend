import api from "@/lib/axios";
import type { ConversationResponse, Message } from "@/types/chat";

interface fetchMessageProps {
    messages:Message[]
    cursor?: string
}
const limit = 50
export const fetchConversations = async (): Promise<ConversationResponse> => {
        const res = await api.get("/conversation");       
        return res.data.metadata;
}

export const fetchMessages = async(fetchConversationsId:string, cursor?:string):Promise<fetchMessageProps> => {
    const query = cursor
        ? `limit=${limit}&cursor=${encodeURIComponent(cursor)}`
        : `limit=${limit}`
    const res = await api.get(`/conversation/${fetchConversationsId}/messages?${query}`);
     
    return {
        messages: res.data.metadata.messages,
        cursor: res.data.metadata.nextCursor
    }
}

export const sendDirectMessage = async( recipientId: string, content: string , imageUrl?: string , conversationId?: string ) => {
    const res = await api.post(`/message/direct`, { recipientId, content, imageUrl, conversationId });
    return res.data.metadata;
}

export const sendGroupMessage = async( conversationId: string, content: string , imageUrl?: string ) => {
    const res = await api.post(`/message/group`, { content, imageUrl, conversationId });
    return res.data.metadata;
}

export const markConversationAsRead = async (conversationId: string) => {
    const res = await api.post(`/conversation/${conversationId}/read`)
    return res.data.metadata
}