import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { FriendRequest } from "@/types/user";
import { Check, Clock3, UserRound, X } from "lucide-react";

type FriendRequestItemProps = {
  request: FriendRequest;
  mode: "received" | "sent";
  isBusy?: boolean;
  activeAction?: "accept" | "decline" | null;
  onAccept?: (requestId: string, displayName: string) => void;
  onDecline?: (requestId: string, displayName: string) => void;
};

const getInitials = (name: string) => {
  const source = name.trim();
  if (!source) return "?";
  const parts = source.split(" ").filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
};

const formatTimeAgo = (iso?: string) => {
  if (!iso) return "";

  const time = new Date(iso).getTime();
  if (Number.isNaN(time)) return "";

  const diffMs = Date.now() - time;
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diffMs < minute) return "just now";
  if (diffMs < hour) return `${Math.floor(diffMs / minute)}m ago`;
  if (diffMs < day) return `${Math.floor(diffMs / hour)}h ago`;
  return `${Math.floor(diffMs / day)}d ago`;
};

const FriendRequestItem = ({
  request,
  mode,
  isBusy = false,
  activeAction = null,
  onAccept,
  onDecline,
}: FriendRequestItemProps) => {
  const name = request.displayName || request.username;
  const timeText = formatTimeAgo(request.createdAt);

  return (
    <li className="flex items-center justify-between rounded-lg border bg-card px-3 py-3 shadow-xs">
      <div className="flex min-w-0 items-center gap-3">
        <Avatar>
          <AvatarImage src={request.avatarUrl} alt={name} />
          <AvatarFallback>{getInitials(name)}</AvatarFallback>
        </Avatar>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{name}</p>
          <p className="truncate text-xs text-muted-foreground">@{request.username}</p>
          {request.message ? (
            <p className="mt-1 truncate text-xs text-foreground/80">"{request.message}"</p>
          ) : null}
          {timeText ? (
            <p className="mt-1 inline-flex items-center gap-1 text-[11px] text-muted-foreground">
              <Clock3 className="size-3" />
              {timeText}
            </p>
          ) : null}
        </div>
      </div>

      {mode === "received" ? (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={isBusy}
            onClick={() => onDecline?.(request.id, name)}
          >
            <X />
            {isBusy && activeAction === "decline" ? "Declining..." : "Decline"}
          </Button>
          <Button size="sm" disabled={isBusy} onClick={() => onAccept?.(request.id, name)}>
            <Check />
            {isBusy && activeAction === "accept" ? "Accepting..." : "Accept"}
          </Button>
        </div>
      ) : (
        <div className="inline-flex items-center gap-1 rounded-full border border-amber-300/60 bg-amber-50 px-2.5 py-1 text-xs text-amber-700 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-300">
          <UserRound className="size-3.5" />
          Da gui
        </div>
      )}
    </li>
  );
};

export default FriendRequestItem;
