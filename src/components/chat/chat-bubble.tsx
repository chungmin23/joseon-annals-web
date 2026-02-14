"use client";

import { cn } from "@/lib/utils";
import { Message } from "@/types/chat";
import { Sparkles } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface ChatBubbleProps {
    message: Message;
    profileImageUrl?: string;
    showRelated?: boolean;
    showLoadingRecs?: boolean;
    onRelatedClick?: () => void;
    isNew?: boolean;
    onTypingComplete?: () => void;
}

export function TypingIndicator({ profileImageUrl }: { profileImageUrl?: string }) {
    return (
        <div className="flex w-full mb-6 justify-start">
            <div className="w-10 h-10 rounded-full bg-[var(--bg-secondary)] overflow-hidden mr-3 flex-shrink-0 relative border border-[var(--border)] shadow-sm">
                <img
                    src={profileImageUrl || "/king.png"}
                    alt="Assistant"
                    onError={(e) => { (e.target as HTMLImageElement).src = "/king.png"; }}
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[var(--accent-emerald)] border-2 border-white rounded-full" />
            </div>
            <div className="bg-white border border-[var(--border)] rounded-[20px] rounded-tl-none px-5 py-4 shadow-sm flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[var(--text-muted)] animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-[var(--text-muted)] animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-[var(--text-muted)] animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
        </div>
    );
}

export function ChatBubble({ message, profileImageUrl, showRelated, showLoadingRecs, onRelatedClick, isNew, onTypingComplete }: ChatBubbleProps) {
    const isUser = message.role?.toUpperCase() === 'USER';
    const shouldAnimate = isNew && !isUser;

    const [displayedContent, setDisplayedContent] = useState(shouldAnimate ? '' : message.content);
    const doneRef = useRef(!shouldAnimate);

    useEffect(() => {
        if (!shouldAnimate || doneRef.current) return;

        const fullText = message.content;
        const charsPerTick = Math.max(1, Math.ceil(fullText.length / 150));
        let index = 0;

        const timer = setInterval(() => {
            index += charsPerTick;
            setDisplayedContent(fullText.slice(0, index));
            if (index >= fullText.length) {
                setDisplayedContent(fullText);
                clearInterval(timer);
                doneRef.current = true;
                onTypingComplete?.();
            }
        }, 15);

        return () => clearInterval(timer);
    }, []);

    const isTyping = shouldAnimate && displayedContent.length < message.content.length;

    const date = new Date(message.timestamp);
    const isValidDate = !isNaN(date.getTime());
    const timeString = isValidDate ? date.toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    }) : "";

    return (
        <div className={cn("flex w-full mb-6", isUser ? "justify-end" : "justify-start")}>
            {!isUser && (
                <div className="w-10 h-10 rounded-full bg-[var(--bg-secondary)] overflow-hidden mr-3 flex-shrink-0 relative border border-[var(--border)] shadow-sm">
                    <img
                        src={profileImageUrl || "/king.png"}
                        alt="Assistant"
                        onError={(e) => { (e.target as HTMLImageElement).src = "/king.png"; }}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[var(--accent-emerald)] border-2 border-white rounded-full" />
                </div>
            )}

            <div className={cn("flex flex-col max-w-[75%]", isUser ? "items-end" : "items-start")}>
                <div className={cn(
                    "relative px-5 py-4 text-sm leading-relaxed shadow-sm",
                    isUser
                        ? "bg-[#2a2a2a] text-white rounded-[20px] rounded-tr-none"
                        : "bg-white border border-[var(--border)] text-[var(--text-primary)] rounded-[20px] rounded-tl-none"
                )}>
                    <div className="whitespace-pre-wrap font-serif">
                        {displayedContent}
                        {isTyping && (
                            <span className="inline-block w-0.5 h-[1em] bg-current ml-0.5 align-middle animate-pulse" />
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2 mt-1.5 px-1">
                    {!isUser && showRelated && (
                        <button
                            onClick={onRelatedClick}
                            className="flex items-center gap-1.5 px-3 py-1 bg-white border border-[var(--accent-gold)] rounded-full shadow-sm hover:bg-[var(--bg-secondary)] transition-colors"
                        >
                            <Sparkles className="w-3 h-3 text-[var(--accent-gold)] fill-[var(--accent-gold)]" />
                            <span className="text-[10px] font-bold text-[var(--text-primary)]">관련 콘텐츠</span>
                        </button>
                    )}
                    {!isUser && !showRelated && showLoadingRecs && (
                        <div className="flex items-center gap-1 px-2 py-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-muted)] animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-muted)] animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-muted)] animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    )}
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
