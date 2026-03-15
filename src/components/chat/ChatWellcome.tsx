type ChatWellcomeProps = {
	hasSelectedConversation?: boolean;
};

const ChatWellcome = ({ hasSelectedConversation = false }: ChatWellcomeProps) => {
	const title = hasSelectedConversation
		? "Cuộc trò chuyện này chưa có tin nhắn"
		: "Chào mừng bạn đến với Chat App";

	const description = hasSelectedConversation
		? "Hãy gửi lời chào đầu tiên để bắt đầu cuộc trò chuyện."
		: "Chọn một cuộc trò chuyện ở sidebar để bắt đầu nhắn tin với bạn bè.";

	return (
		<div className="flex h-full w-full items-center justify-center rounded-2xl border border-border/70 bg-[linear-gradient(165deg,rgba(255,255,255,0.82),rgba(245,248,255,0.95))] dark:border-border/50 dark:bg-[linear-gradient(165deg,rgba(12,14,16,0.6),rgba(6,8,10,0.85))] p-6">
			<div className="mx-auto flex max-w-md flex-col items-center text-center">
				<div className="mb-6 w-full max-w-xs text-muted-foreground dark:text-muted-foreground/80">
					<svg viewBox="0 0 320 220" fill="none" className="h-auto w-full">
						<rect x="24" y="38" width="164" height="104" rx="16" className="fill-muted" />
						<rect x="42" y="62" width="90" height="10" rx="5" className="fill-background" />
						<rect x="42" y="80" width="124" height="10" rx="5" className="fill-background" />
						<rect x="42" y="98" width="76" height="10" rx="5" className="fill-background" />

						<rect x="136" y="110" width="160" height="92" rx="16" className="fill-primary/20" />
						<rect x="156" y="132" width="84" height="10" rx="5" className="fill-primary/40" />
						<rect x="156" y="150" width="114" height="10" rx="5" className="fill-primary/40" />
						<rect x="156" y="168" width="62" height="10" rx="5" className="fill-primary/40" />

						<circle cx="238" cy="48" r="14" className="fill-primary/25" />
						<circle cx="266" cy="28" r="8" className="fill-primary/15" />
					</svg>
				</div>

				<h2 className="text-xl font-semibold text-foreground dark:text-white">{title}</h2>
				<p className="mt-2 text-sm text-muted-foreground dark:text-muted-foreground/80">{description}</p>
			</div>
		</div>
	);
};

export default ChatWellcome;
