import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import ChatWindowLayout from "@/components/chat/ChatWindowLayout"

const HomePage = () => {

  return (
    <SidebarProvider className="h-svh max-h-svh overflow-hidden">
      <AppSidebar />
      <div className="flex h-full min-h-0 w-full overflow-hidden p-2">
        <ChatWindowLayout />
      </div>
    </SidebarProvider>
  )
}

export default HomePage
