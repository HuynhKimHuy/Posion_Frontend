import type { FormEvent } from "react";
import type { FieldErrors, UseFormRegister, UseFormWatch } from "react-hook-form"
import type { AddFriendModalProps } from "../AddFriendModal";
import type { User } from "@/types/user";
import { Textarea } from "@/components/ui/textarea";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
export interface SendFriendRequestProps {
    loading: boolean;
    register: UseFormRegister<AddFriendModalProps>
    errors: FieldErrors<AddFriendModalProps>
    watch: UseFormWatch<AddFriendModalProps>
    foundUser: User | null;
    alreadySent: boolean;
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
    onBack: () => void;
}

const SendFriendRequest = ({
    register,
        errors,
        watch,
    foundUser,
    alreadySent,
    onSubmit,
    onBack,
    loading

}: SendFriendRequestProps) => {
    const messageValue = watch("message") || "";
    const displayName = [foundUser?.firstName, foundUser?.lastName].filter(Boolean).join(" ").trim();
    const finalName = displayName || foundUser?.userName || "Unknown user";
    const fallbackName = foundUser?.userName || finalName;

    const getInitials = (name: string) => {
        const source = name.trim();
        if (!source) return "?";
        const parts = source.split(" ").filter(Boolean);
        if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
        return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
    };

    return(
      <>
        <div className="rounded-lg border bg-card p-3">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Found user</p>
            <div className="flex items-center gap-3">
                <Avatar size="lg">
                    <AvatarImage src={foundUser?.avatarUrl} alt={finalName} />
                    <AvatarFallback>{getInitials(fallbackName)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{finalName}</p>
                    <p className="truncate text-xs text-muted-foreground">@{foundUser?.userName || "unknown"}</p>
                    {foundUser?.email ? (
                        <p className="truncate text-xs text-muted-foreground">{foundUser.email}</p>
                    ) : null}
                </div>
            </div>
        </div>

        {alreadySent ? (
            <div className="space-y-4">
                <div className="rounded-lg border border-amber-300/60 bg-amber-50 p-4 text-center dark:border-amber-500/40 dark:bg-amber-500/10">
                    <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                        📤 Đã gửi lời mời kết bạn
                    </p>
                    <p className="mt-1 text-xs text-amber-700 dark:text-amber-300/80">
                        Bạn đã gửi lời mời cho {finalName}. Hãy chờ phản hồi từ họ.
                    </p>
                </div>
                <DialogFooter>
                    <Button type="button" className="flex-1 glass" onClick={onBack}>
                        Quay lại
                    </Button>
                </DialogFooter>
            </div>
        ) : (
            <form action="" onSubmit={onSubmit} className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-semibold">
                        Gửi yêu cầu kết bạn
                    </label>
                    <Textarea 
                        className="glass border-border/50 focus:border-primary/50 transition:smooth resize-none" 
                        rows={3} 
                        placeholder="Chào bạn..."
                        {...register("message", {
                            required: "Message is required",
                            validate: (value) => value.trim().length > 0 || "Message is required",
                            maxLength: {
                                value: 200,
                                message: "Message must be 200 characters or fewer"
                            }
                        })}
                    />
                    <div className="flex items-center justify-between">
                        {errors.message ? (
                            <p className="text-xs font-medium text-destructive">{errors.message.message}</p>
                        ) : (
                            <p className="text-xs text-muted-foreground">Write a short intro message.</p>
                        )}
                        <span className="text-xs text-muted-foreground">{messageValue.length}/200</span>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" disabled={loading} variant={"outline"} className="flex-1 glass hover:text-destructive" onClick={onBack}>
                       Quay lại
                    </Button>
                    <Button type="submit" disabled={loading} className="flex-1 glass hover:text-primary text-white hover:opacity-90 transition-smooth disabled:cursor-not-allowed disabled:opacity-50">
                        {loading ? (<span>Đang gửi...</span>) : (
                           <>
                            <UserPlus className="size-4 mr-2 "  /> Kết Bạn
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </form>
        )}
      </>
    )
}

export default SendFriendRequest;