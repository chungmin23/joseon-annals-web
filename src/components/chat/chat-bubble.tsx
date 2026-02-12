import { cn } from "@/lib/utils";
import { Message } from "@/types/chat";
import Image from "next/image";
import { Sparkles } from "lucide-react";

interface ChatBubbleProps {
    message: Message;
    profileImageUrl?: string; // For assistant
    showRelated?: boolean;
    onRelatedClick?: () => void;
}

export function ChatBubble({ message, profileImageUrl, showRelated, onRelatedClick }: ChatBubbleProps) {
    const isUser = message.role?.toUpperCase() === 'USER';

    // Format time from timestamp (unix epoch ms)
    const date = new Date(message.timestamp);
    const isValidDate = !isNaN(date.getTime());
    const timeString = isValidDate ? date.toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    }) : "";

    return (
        <div className={cn("flex w-full mb-6", isUser ? "justify-end" : "justify-start")}>
            {/* Avatar for Assistant */}
            {!isUser && (
                <div className="w-10 h-10 rounded-full bg-[var(--bg-secondary)] overflow-hidden mr-3 flex-shrink-0 relative border border-[var(--border)] shadow-sm">
                    {profileImageUrl ? (
                        <Image src={profileImageUrl} alt="Assistant" fill className="object-cover" />
                    ) : (
                        <img src="/king.png" alt="Assistant" className="absolute inset-0 w-full h-full object-cover" />
                    )}
                    {/* Online status indicator if needed */}
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[var(--accent-emerald)] border-2 border-white rounded-full"></div>
                </div>
            )}

            <div className={cn("flex flex-col max-w-[75%]", isUser ? "items-end" : "items-start")}>
                {/* Bubble */}
                <div className={cn(
                    "relative px-5 py-4 text-sm leading-relaxed shadow-sm",
                    isUser
                        ? "bg-[#2a2a2a] text-white rounded-[20px] rounded-tr-none"
                        : "bg-white border border-[var(--border)] text-[var(--text-primary)] rounded-[20px] rounded-tl-none"
                )}>
                    <div className="whitespace-pre-wrap font-serif">
                        {message.content}
                    </div>
                </div>

                {/* Info Area (Time, Related) */}
                <div className="flex items-center gap-2 mt-1.5 px-1">
                    {/* Related Content Button for Assistant */}
                    {!isUser && showRelated && (
                        <button
                            onClick={onRelatedClick}
                            className="flex items-center gap-1.5 px-3 py-1 bg-white border border-[var(--accent-gold)] rounded-full shadow-sm hover:bg-[var(--bg-secondary)] transition-colors"
                        >
                            <Sparkles className="w-3 h-3 text-[var(--accent-gold)] fill-[var(--accent-gold)]" />
                            <span className="text-[10px] font-bold text-[var(--text-primary)]">관련 콘텐츠</span>
                        </button>
                    )}

                    {/* Time */}
                    {timeString && (
                        <span className="text-[10px] text-[var(--text-muted)] font-medium">
                            {timeString}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
