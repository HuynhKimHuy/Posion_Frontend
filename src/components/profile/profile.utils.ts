import type { User } from "@/types/user";

export const buildProfileDisplayName = (user: User) =>
  `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.userName;

export const getProfileInitials = (name: string) => {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
};
