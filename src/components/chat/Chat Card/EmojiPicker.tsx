import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { SmileIcon } from "lucide-react"
import Picker from "@emoji-mart/react"
import data from "@emoji-mart/data"
import { useThemeStore } from "@/stores/useThemeStore"

type EmojiProps = {
  onChange: (emoji: string) => void
}

const EmojiPicker = ({ onChange }: EmojiProps) => {
  const isDarkMode = useThemeStore((state) => state.isDarkMode)

  return (
    <Popover>
      <PopoverTrigger className="cursor-pointer">
        <SmileIcon className="w-5 h-5" />
      </PopoverTrigger>
      <PopoverContent 
      >
        <Picker
        size="right"
      sideOffset={80}
      className="bg-transparent boder-none shadow-none drop-shadow-none mb-12"
          theme={isDarkMode ? "dark" : "light"}
          data={data}
          onEmojiSelect={(emoji: { native: string }) => onChange(emoji.native)}
          emojisize={18}
          
        />
      </PopoverContent>
    </Popover>
  )
}

export default EmojiPicker