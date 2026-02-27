import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import ChatWindowLayout from "@/components/chat/ChatWindowLayout"
import { useChatStore } from "@/stores/useChatStore"
import { useAuthStore } from "@/stores/useAuthStore"
import { useEffect } from "react"

const HomePage = () => {
  const { loadConversations } = useChatStore()
  const { accessToken } = useAuthStore()

  useEffect(() => {
    if (accessToken) {
      console.log("🔄 [HomePage] Authenticated, loading conversations...")
      loadConversations()
    }
  }, [accessToken, loadConversations])

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex w-full p-2 ">
        <ChatWindowLayout />
      </div>
    </SidebarProvider>
  )
}

export default HomePage
