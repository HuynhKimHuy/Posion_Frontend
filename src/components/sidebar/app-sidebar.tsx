"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,
  Frame,
  Map,
  Moon,
  PieChart,
  Settings2,
  SquareTerminal,
  Sun,
} from "lucide-react"

 import  NewGroupChatModal  from "../chat/NewGroupChatModal.tsx"

import { NavUser } from "@/components/sidebar/nav-user"
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
import GroupChatList from "../chat/GroupChatList"
import AddFriendModal from "../chat/AddFriendModal.tsx"
import DirectMessageList from "../chat/DirectMessageList.tsx"

import { useThemeStore } from "@/stores/useThemeStore"
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],

  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const {isDarkMode, toggleTheme} = useThemeStore()
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className=" bg-blue-600 ">
              <a href="#">
                <div className="w-full flex justify-between items-center ">
                  <h1 className="text-2xl font-bold">Posion</h1>
                  <div className="flex item-center gap-2">
                    <Sun className="size-4 text-white/80" />
                    <Switch 
                    checked={isDarkMode}
                    onCheckedChange={toggleTheme} 
                    className="data-[state=checked]:bg-background/80"
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
            <CreatedNewChat/>
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
            <AddFriendModal/>
          </SidebarGroupAction>
        </SidebarGroup>
          
          {/* Direct Message */}
          <SidebarGroup className="uppercase">
            <DirectMessageList></DirectMessageList>
           </SidebarGroup>


      </SidebarContent>

      {/* Direct messgae */}
      

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
