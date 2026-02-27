import type { Conversation, Message } from "./chat"
import type { User } from "./user"

export interface authState {
    accessToken: string | null,
    user: User | null,
    loading: boolean,
    signUp: (userName: string, password: string, email: string, firstName: string, lastName: string) => Promise<void>

    signIn: (email: string, password: string) => Promise<boolean>

    clearState: () => void

    logOut: () => Promise<void>
    fetchMe: (accessToken: string) => Promise<any>
    

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
        nexCursor?: string | null;

    }>, // key = conversationId
    activeConversationId: string | null,
    loading:boolean,
    resetChatState: () => void,
    setActiveConversation: (conversationId: string | null) => void,
    
    loadConversations: () => Promise<void>,
}