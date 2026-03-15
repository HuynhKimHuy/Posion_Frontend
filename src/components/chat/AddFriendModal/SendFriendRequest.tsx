import type { UseFormRegister } from "react-hook-form"
import { Textarea } from "@/components/ui/textarea";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
export interface SendFriendRequestProps {
    loading: boolean;
    register:UseFormRegister<any>
    searchUserName : string;
     onSubmit:(e: React.FormEvent<HTMLFormElement>) => void;
    onBack: () => void;
}

const SendFriendRequest = ({
    register,
    searchUserName,
    onSubmit,
    onBack,
    loading

}: SendFriendRequestProps) => {
    return(
      <form action="" onSubmit={onSubmit } className="space-y-4">
        <div>
            <span className="Success-message">
                Tìm Thấy người dùng: <span className="font-medium">{searchUserName}</span>
            </span>

            <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-semibold ">
                    Gửi yêu cầu kết bạn
                </label>
                <Textarea 
                    className="glass border-border/50 focus:border-primary/50 transition:smooth resize-none" 
                    rows={3} 
                    placeholder="Chào bạn..."
                    {...register("message")}
                />
            </div>
            <DialogFooter>
                <Button type="submit" disabled={loading} variant={"outline"} className="flex-1 glass hover:text-destructive" onClick={onBack}>
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
        </div>

      </form>
    )
}