import type { User } from "@/types/user";
import { PROFILE_FALLBACK_TEXT, PROFILE_ROLE_LABELS } from "./profile.constants";

export const buildProfileDisplayName = (user: User) =>
  `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.userName;

export const getProfileInitials = (name: string) => {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
};

export const formatProfileDateTime = (value?: string) => {
  if (!value) return PROFILE_FALLBACK_TEXT;
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return PROFILE_FALLBACK_TEXT;
  }

  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsed);
};

export const getReadableRole = (role?: string) => {
  if (!role) return PROFILE_FALLBACK_TEXT;
  return PROFILE_ROLE_LABELS[role] ?? role;
};
