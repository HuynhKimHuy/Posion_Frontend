import { useAuthStore } from "@/stores/useAuthStore"
import { ImagePlay, Send } from "lucide-react"
import { useState } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import EmojiPicker from "./Chat Card/EmojiPicker"
import { useChatStore } from "@/stores/useChatStore"
import type { Conversation } from "@/types/chat"

const MessageInput = ({selectedConversation}:{selectedConversation: Conversation | null}) => {
const {user } = useAuthStore()
const [value , setValue] = useState("")


    const sendMessage = async () => {
        if(!value.trim() || !selectedConversation) return
        try {
            if(selectedConversation.type === "direct"){
             const participan = selectedConversation.participants.find((p) => p.userId !== user?._id)
             if(!participan) return

             await useChatStore.getState().sendDirectMessage(participan.userId, value.trim(), undefined, selectedConversation._id)
             setValue("")
             return
            }

            await useChatStore.getState().sendGroupMessage(selectedConversation._id, value.trim())
            setValue("")
        } catch (error) {
            console.error("Error sending message:", error)
        }
    }
    if(!user) {
        return null
    }
    
    return (
        <div className="glass flex min-h-14 w-full items-center gap-2 rounded-2xl p-2.5">
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full p-0 hover:bg-primary/10">
            <ImagePlay className="size-4"/>
           </Button>

           <div
            className="flex-1 relative">
            <Input 
                onKeyDown={(e)=> {
                    if(e.key === "Enter" && !e.shiftKey){
                        e.preventDefault()
                        sendMessage()
                    }
                }}
                type="text" 
                placeholder="Nhập tin nhắn..." 
                className="h-10 w-full rounded-full border border-border/80 bg-muted/50 pr-10 pl-4 text-sm text-foreground transition-smooth placeholder:text-muted-foreground focus-visible:border-primary/40 focus-visible:ring-2 focus-visible:ring-primary/15"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                <EmojiPicker onChange={(emoji) => setValue((prev) => prev + emoji)} />
            </div>
            
           </div>
           <Button 
            onClick={sendMessage}
            className="rounded-full bg-primary text-primary-foreground transition-smooth hover:bg-primary/90" disabled={!value.trim()}>
                <Send className="size-4 text-white"/>
            </Button>
        </div>
    )
}

export default  MessageInput