export interface User {
    _id: string;
    userName: string;
    email: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
    coverUrl?: string;
    bio?: string;
    roles: string;
    verfify?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface UserProfile extends User {
    displayName?: string; // firstName + lastName
    bio?: string;
    phone?: string;
}
export interface Friend {
    _id: string;
    username: string;
    displayName: string;
    avatarUrl?: string;
}

export interface FriendRequest {
    id: string;
    userId?: string;
    username: string;
    displayName: string;
    avatarUrl?: string;
    createdAt?: string;
    message?: string;
}