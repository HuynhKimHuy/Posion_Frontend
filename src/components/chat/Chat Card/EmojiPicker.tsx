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
      <PopoverTrigger className="cursor-pointer rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
        <SmileIcon className="h-5 w-5" />
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="end"
        sideOffset={12}
        className="w-fit rounded-2xl border-border/60 bg-popover/95 p-0 shadow-xl backdrop-blur supports-backdrop-filter:bg-popover/85"
      >
        <Picker
          className="overflow-hidden rounded-2xl"
          theme={isDarkMode ? "dark" : "light"}
          data={data}
          onEmojiSelect={(emoji: { native?: string }) => {
            if (!emoji.native) return
            onChange(emoji.native)
          }}
          emojiSize={20}
          emojiButtonSize={34}
          perLine={8}
          previewPosition="none"
          skinTonePosition="search"
          navPosition="bottom"
        />
      </PopoverContent>
    </Popover>
  )
}

export default EmojiPicker