import type { Conversation, Message } from "./chat"
import type { Friend, FriendRequest, User } from "./user"

export interface authState {
    accessToken: string | null,
    user: User | null,
    loading: boolean,
    signUp: (userName: string, password: string, email: string, firstName: string, lastName: string) => Promise<void>

    signIn: (email: string, password: string) => Promise<boolean>

    clearState: () => void

    logOut: () => Promise<void>
    fetchMe: (accessToken: string) => Promise<any>
    refresh: () => Promise<string|null>

}

export interface themeState {
    isDarkMode: boolean,
    toggleTheme: () => void,
    setTheme: (isDark: boolean) => void
}


export interface chatState {
    conversations: Conversation[],
    messages: Record<string, {
        items: Message[];
        hasMore: boolean;
        nextCursor?: string | null;

    }>, // key = conversationId
    activeConversationId: string | null,
    loading:boolean,
    messagesLoading:boolean,
    resetChatState: () => void,
    setActiveConversation: (conversationId: string | null) => void,
    loadConversations: () => Promise<void>,
    fetchMessages: (conversationId: string, cursor?: string) => Promise<void>
    markConversationAsRead: (conversationId: string, forceSync?: boolean) => Promise<void>
    sendDirectMessage: (recipientId: string, content: string, imageUrl?: string, conversationId?: string) => Promise<void>
    sendGroupMessage: (conversationId: string, content: string, imageUrl?: string) => Promise<void>
    addMessage:(Message:Message)=>Promise<any>
    updateConversation:(conversation:Conversation)=> void
}
export interface friendState {
    loading: boolean,
    friends: Friend[],
    receivedRequests: FriendRequest[],
    sentRequests: FriendRequest[],
    searchByUserName: (query: string) => Promise<User|null>,
    sendFriendRequest: (to: string, message: string) => Promise<string>
    getAllFriendsRequest: () => Promise<void>
    acceptFriendRequest: (requestId: string) => Promise<User>
    declineFriendRequest: (requestId: string) => Promise<string>
    getFriendList: () => Promise<void>

}