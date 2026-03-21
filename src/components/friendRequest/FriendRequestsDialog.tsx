import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFriendStore } from "@/stores/useFriendStore";
import FriendRequestItem from "@/components/friendRequest/FriendRequestItem";
import { toast } from "sonner";

interface FriendRequestsDialogProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

const FriendRequestsDialog = ({ open, setOpen }: FriendRequestsDialogProps) => {
    const [tab, setTab] = useState("received");
    const [activeRequestId, setActiveRequestId] = useState<string | null>(null);
    const [activeAction, setActiveAction] = useState<"accept" | "decline" | null>(null);
    const getAllFriendsRequest = useFriendStore((state) => state.getAllFriendsRequest);
    const acceptFriendRequest = useFriendStore((state) => state.acceptFriendRequest);
    const declineFriendRequest = useFriendStore((state) => state.declineFriendRequest);
    const receivedRequests = useFriendStore((state) => state.receivedRequests);
    const sentRequests = useFriendStore((state) => state.sentRequests);
    const loading = useFriendStore((state) => state.loading);

    useEffect(() => {
        if (!open) return;
        const loadRequests = async () => {
            await getAllFriendsRequest();
        };
        loadRequests();
    }, [open, getAllFriendsRequest]);

    useEffect(() => {
        if (!open) {
            setTab("received");
            setActiveRequestId(null);
            setActiveAction(null);
        }
    }, [open]);

    const handleAccept = async (requestId: string, displayName: string) => {
        try {
            setActiveRequestId(requestId);
            setActiveAction("accept");
            await acceptFriendRequest(requestId);
            toast.success(`Accepted ${displayName}`);
        } catch (error) {
            console.error("Failed to accept request:", error);
            toast.error("Failed to accept friend request.");
        } finally {
            setActiveRequestId(null);
            setActiveAction(null);
        }
    };

    const handleDecline = async (requestId: string, displayName: string) => {
        try {
            setActiveRequestId(requestId);
            setActiveAction("decline");
            await declineFriendRequest(requestId);
            toast.success(`Declined ${displayName}`);
        } catch (error) {
            console.error("Failed to decline request:", error);
            toast.error("Failed to decline friend request.");
        } finally {
            setActiveRequestId(null);
            setActiveAction(null);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Friend Requests</DialogTitle>
                    <DialogDescription>Review incoming requests and track requests you already sent.</DialogDescription>
                </DialogHeader>

                <Tabs value={tab} onValueChange={setTab}>
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="received">Received ({receivedRequests.length})</TabsTrigger>
                        <TabsTrigger value="sent">Sent ({sentRequests.length})</TabsTrigger>
                    </TabsList>

                    <TabsContent value="received" className="max-h-105 overflow-y-auto pr-1">
                        {loading ? (
                            <p className="text-sm text-muted-foreground">Loading requests...</p>
                        ) : receivedRequests.length === 0 ? (
                            <p className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">No received requests.</p>
                        ) : (
                            <ul className="space-y-2">
                                {receivedRequests.map((request) => (
                                    <FriendRequestItem
                                        key={request.id}
                                        request={request}
                                        mode="received"
                                        isBusy={activeRequestId === request.id}
                                        activeAction={activeAction}
                                        onAccept={handleAccept}
                                        onDecline={handleDecline}
                                    />
                                ))}
                            </ul>
                        )}
                    </TabsContent>

                    <TabsContent value="sent" className="max-h-105 overflow-y-auto pr-1">
                        {loading ? (
                            <p className="text-sm text-muted-foreground">Loading requests...</p>
                        ) : sentRequests.length === 0 ? (
                            <p className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">No sent requests.</p>
                        ) : (
                            <>
                                <div className="mb-3 rounded-md border border-amber-300/60 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-300">
                                    You already sent {sentRequests.length} friend request{sentRequests.length > 1 ? "s" : ""}. Waiting for the other user to accept.
                                </div>
                                <ul className="space-y-2">
                                    {sentRequests.map((request) => (
                                        <FriendRequestItem
                                            key={request.id}
                                            request={request}
                                            mode="sent"
                                        />
                                    ))}
                                </ul>
                            </>
                        )}
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
};

export default FriendRequestsDialog;