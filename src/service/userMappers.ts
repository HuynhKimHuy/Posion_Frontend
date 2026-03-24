type LooseUserPayload = Record<string, any> | null | undefined;

const pickImageUrl = (...values: unknown[]) => {
    for (const value of values) {
        if (typeof value === "string" && value.trim()) {
            return value.trim();
        }
    }
    return null;
}

export const normalizeUserPayload = <T extends LooseUserPayload>(user: T): T => {
    if (!user || typeof user !== "object") {
        return user;
    }

    const normalized = {
        ...user,
        avatarUrl: pickImageUrl(user.avatarUrl, user.avatarURL, user.avatar),
        coverUrl: pickImageUrl(user.coverUrl, user.coverURL, user.cover),
    };

    return normalized as T;
};