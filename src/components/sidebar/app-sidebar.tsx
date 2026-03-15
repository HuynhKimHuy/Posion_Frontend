"use client"

import * as React from "react"
import {
  Moon,
  Sun
} from "lucide-react"

import NewGroupChatModal from "../chat/NewGroupChatModal.tsx"


import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Switch } from "../ui/switch"
import CreatedNewChat from "../chat/CreatedNewChat"
import GroupChatList from "../chat/Chat Card/GroupChatList.tsx"
import AddFriendModal from "../chat/AddFriendModal.tsx"
import DirectMessageList from "../chat/Chat Card/DirectMessageList.tsx"

import { useThemeStore } from "@/stores/useThemeStore"

import { useAuthStore } from "@/stores/useAuthStore.ts"
import { NavUser } from "./nav-user.tsx"


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const {user} = useAuthStore()
  const { isDarkMode, toggleTheme } = useThemeStore()
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="bg-sidebar-primary rounded-xl shadow-sm border border-white/10">
              <a href="#">
                <div className="w-full flex justify-between items-center">
                  <h1 className="text-2xl font-extrabold tracking-tight text-white">Posion</h1>
                  <div className="flex item-center gap-2">
                    <Sun className="size-4 text-white/80" />
                    <Switch
                      checked={isDarkMode}
                      onCheckedChange={toggleTheme}
                      className="data-[state=checked]:bg-white/90 data-[state=unchecked]:bg-white/40"
                    />
                    <Moon className="size-4 text-white/80" />
                  </div>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Group messgae */}
      <SidebarContent>

        {/* newchat */}
        <SidebarGroup>
          <SidebarGroupContent>
            <CreatedNewChat />
          </SidebarGroupContent>
        </SidebarGroup>
        {/* GroupCHat */}
        <SidebarGroup className="uppercase">
          <SidebarGroupLabel className="uppercase">Group Chats</SidebarGroupLabel>

          <SidebarGroupAction title="Tạo Nhóm" className="cursor-pointer">
            <NewGroupChatModal>

            </NewGroupChatModal>
          </SidebarGroupAction>

          <SidebarContent>
            {/* List group chat here */}
            <GroupChatList >

            </GroupChatList >

          </SidebarContent>

        </SidebarGroup>

        {/*NewFriend */}
        <SidebarGroup className="uppercase">
          <SidebarGroupLabel className="uppercase">Bạn Bè</SidebarGroupLabel>
          <SidebarGroupAction title="kết bạn mới" className="cursor-pointer">
            <AddFriendModal />
          </SidebarGroupAction>
        </SidebarGroup>

        {/* Direct Message */}
        <SidebarGroup className="uppercase">
          <DirectMessageList></DirectMessageList>
        </SidebarGroup>


      </SidebarContent>

      {/* Direct messgae */}


      <SidebarFooter>
        {user && <NavUser user={user} />}
      </SidebarFooter>
    </Sidebar>
  )
}
