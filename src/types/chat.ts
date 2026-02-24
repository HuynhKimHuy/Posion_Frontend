export interface Participant {
  userId: string;
  userName?: string;
  displayName?: string;
  email?: string;
  avatarUrl?: string | null;
  role?: "admin" | "member";
  joinedAt: string;
}

export interface SeenUser {
  _id: string;
  displayName?: string;
  avatarUrl?: string | null;
}

export interface Group {
  name: string;
  createdBy: string;
}

export interface LastMessage {
  _id: string;
  content: string;
  createdAt: string;
  sender: {
    _id: string;
    displayName: string;
    avatarUrl?: string | null;
  };
}

export interface Conversation {
  _id: string;
  type: "direct" | "group";
  name?: string | null;
  group?: Group | null;
  participants: Participant[];
  lastMessageAt?: string | null;
  seenBy: SeenUser[];
  lastMessage: LastMessage | null;
  unreadCounts?: Record<string, number>; // key = userId, value = unread count
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationResponse {
  conversations: Conversation[];
  total: number;
}

export interface Message {
  _id: string;
  conversationId: string;
  senderId: string;
  content: string | null;
  imgUrl?: string | null;
  updatedAt?: string | null;
  createdAt: string;
  isOwn?: boolean;
}

