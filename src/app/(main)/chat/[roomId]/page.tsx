"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, MoreHorizontal, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { Message } from "@/types/chat";
import { getMessages, sendMessage, getChatRoom } from "@/lib/api/chat";
import { getRecommendedContents } from "@/lib/api/contents";
import { ChatBubble } from "@/components/chat/chat-bubble";
import { ChatInput } from "@/components/chat/chat-input";
import { Skeleton } from "@/components/ui/skeleton";
import { ContentBottomSheet } from "@/components/content/content-bottom-sheet";

export default function ChatRoomPage() {
    const params = useParams();
    const router = useRouter();
    const roomId = params.roomId as string;
    const scrollRef = useRef<HTMLDivElement>(null);
    const shouldScrollRef = useRef(false);

    const [messages, setMessages] = useState<Message[]>([]);
    const [isSheetOpen, setIsSheetOpen] = useState(false); // Controls bottom sheet visibility

    // Fetch specific room to get persona info (flat response from backend)
    const { data: currentRoom } = useQuery({
        queryKey: ['room', roomId],
        queryFn: () => getChatRoom(roomId),
        staleTime: 60 * 1000,
    });

    // Fetch recommended contents for the sparkle button
    const { data: recommendations = [] } = useQuery({
        queryKey: ['recommendations', currentRoom?.personaId],
        queryFn: () => getRecommendedContents(currentRoom!.personaId),
        enabled: !!currentRoom?.personaId,
    });

    const safeRecommendations = Array.isArray(recommendations) ? recommendations : [];

    // Fetch messages with polling
    const { data: fetchedMessages, isLoading } = useQuery({
        queryKey: ['messages', roomId],
        queryFn: () => getMessages(roomId),
        refetchInterval: 5000,
    });

    useEffect(() => {
        if (fetchedMessages) {
            const sorted = [...fetchedMessages].sort((a, b) => a.timestamp - b.timestamp);
            setMessages(sorted);
        }
    }, [fetchedMessages]);

    // Only scroll to bottom when user sends a message
    useEffect(() => {
        if (shouldScrollRef.current && scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
            shouldScrollRef.current = false;
        }
    }, [messages]);

    const handleSend = async (text: string) => {
        // Optimistic update
        const tempId = Date.now().toString();
        const tempMessage: Message = {
            messageId: tempId,
            role: 'USER',
            content: text,
            timestamp: Date.now()
        };
        setMessages(prev => [...prev, tempMessage]);
        shouldScrollRef.current = true;

        try {
            await sendMessage(roomId, text);
            // Polling will pick up the AI response automatically
        } catch (e) {
            console.error("Failed to send", e);
            // Revert optimistic update on failure
            setMessages(prev => prev.filter(m => m.messageId !== tempId));
        }
    };

    // Helper to render date separator from timestamp
    const renderDateSeparator = (timestamp: number) => {
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) return null;
        const formattedDate = date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'short'
        });
        return (
            <div className="flex justify-center my-6">
                <span className="text-[10px] text-[var(--text-muted)] bg-[var(--border)]/30 px-3 py-1 rounded-full">
                    {formattedDate}
                </span>
            </div>
        );
    };

    return (
        <div className="flex flex-col h-screen bg-[var(--bg-primary)]">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 h-16 bg-[var(--bg-primary)]/80 backdrop-blur-md z-50 px-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={() => router.back()} className="p-2 -ml-2 text-[var(--text-primary)]">
                        <ArrowLeft className="w-6 h-6" />
                    </button>

                    {currentRoom ? (
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[var(--bg-secondary)] relative overflow-hidden border border-[var(--border)]">
                                {currentRoom.personaImage ? (
                                    <Image src={currentRoom.personaImage} alt={currentRoom.personaName} fill className="object-cover" />
                                ) : (
                                    <img src="/king.png" alt={currentRoom.personaName} className="absolute inset-0 w-full h-full object-cover" />
                                )}
                                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[var(--accent-emerald)] border-2 border-white rounded-full"></div>
                            </div>
                            <div>
                                <h1 className="text-base font-bold font-serif text-[var(--text-primary)] leading-tight">
                                    {currentRoom.personaName}
                                </h1>
                                <p className="text-[10px] text-[var(--text-secondary)]">
                                    {currentRoom.title}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Skeleton className="w-10 h-10 rounded-full" />
                            <div className="space-y-1">
                                <Skeleton className="w-20 h-4" />
                                <Skeleton className="w-12 h-3" />
                            </div>
                        </div>
                    )}
                </div>

                <button className="p-2 text-[var(--text-primary)]">
                    <div className="w-6 h-6 flex items-center justify-center border-2 border-[var(--text-primary)] rounded-sm">
                        <div className="w-3 h-0.5 bg-[var(--text-primary)] mb-0.5" />
                    </div>
                </button>
            </header>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto pt-20 pb-24 px-4 scrollbar-hide">
                <div className="max-w-md mx-auto">
                    {isLoading && !fetchedMessages ? (
                        <div className="space-y-6 pt-4">
                            <div className="flex gap-3">
                                <Skeleton className="w-10 h-10 rounded-full" />
                                <Skeleton className="h-20 w-3/4 rounded-xl rounded-tl-none" />
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <Skeleton className="h-12 w-1/2 rounded-xl rounded-tr-none" />
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Initial greeting — always visible regardless of message count */}
                            {currentRoom?.greeting && (
                                <>
                                    {renderDateSeparator(currentRoom.createdAt ? new Date(currentRoom.createdAt).getTime() : Date.now())}
                                    <ChatBubble
                                        message={{
                                            messageId: 'initial-greeting',
                                            role: 'ASSISTANT',
                                            content: currentRoom.greeting,
                                            timestamp: currentRoom.createdAt ? new Date(currentRoom.createdAt).getTime() : Date.now()
                                        }}
                                        profileImageUrl={currentRoom?.personaImage}
                                        showRelated={false}
                                        onRelatedClick={() => { }}
                                    />
                                </>
                            )}

                            {/* Conversation messages — skip first ASSISTANT msg (stored greeting) to avoid duplication */}
                            {messages
                                .filter((msg, i) => !(i === 0 && msg.role.toUpperCase() === 'ASSISTANT'))
                                .map((msg, index, arr) => {
                                    const showDateSeparator = index > 0 &&
                                        new Date(msg.timestamp).getDate() !== new Date(arr[index - 1].timestamp).getDate();
                                    return (
                                        <div key={msg.messageId}>
                                            {showDateSeparator && renderDateSeparator(msg.timestamp)}
                                            <ChatBubble
                                                message={msg}
                                                profileImageUrl={currentRoom?.personaImage}
                                                showRelated={safeRecommendations.length > 0}
                                                onRelatedClick={() => setIsSheetOpen(true)}
                                            />
                                        </div>
                                    );
                                })
                            }
                        </>
                    )}
                    <div ref={scrollRef} />
                </div>
            </div>

            {/* Input */}
            <ChatInput onSend={handleSend} />

            <ContentBottomSheet
                isOpen={isSheetOpen}
                onClose={setIsSheetOpen}
                recommendations={safeRecommendations}
            />
        </div>
    );
}
