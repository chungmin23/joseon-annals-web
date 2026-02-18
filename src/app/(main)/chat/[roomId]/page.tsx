"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { Message } from "@/types/chat";
import { ContentItem } from "@/types/content";
import { getMessages, sendMessage, getChatRoom, getDailyUsage } from "@/lib/api/chat";
import { getRoomRecommendations } from "@/lib/api/contents";
import { ChatBubble, TypingIndicator } from "@/components/chat/chat-bubble";
import { ChatInput } from "@/components/chat/chat-input";
import { DailyLimitBadge } from "@/components/chat/daily-limit-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ContentBottomSheet } from "@/components/content/content-bottom-sheet";

export default function ChatRoomPage() {
    const params = useParams();
    const router = useRouter();
    const roomId = params.roomId as string;
    const scrollRef = useRef<HTMLDivElement>(null);
    const shouldScrollRef = useRef(false);
    const queryClient = useQueryClient();

    const [messages, setMessages] = useState<Message[]>([]);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [recommendations, setRecommendations] = useState<ContentItem[]>([]);
    const [isWaiting, setIsWaiting] = useState(false);
    const [isLoadingRecs, setIsLoadingRecs] = useState(false);
    const [dailyUsedCount, setDailyUsedCount] = useState(0);

    // 이미 타이핑 애니메이션을 완료한 메시지 ID 추적
    const typedMessageIds = useRef<Set<string>>(new Set());
    // 이전 ASSISTANT 메시지 수 추적 (-1: 미초기화)
    const prevAssistantCountRef = useRef(-1);
    // 추천 폴링 종료 시각 (메시지 전송 후 15초간만 폴링)
    const recsPollUntilRef = useRef<number>(0);

    // 일일 대화 횟수 조회
    const { data: dailyUsage } = useQuery({
        queryKey: ['daily-usage'],
        queryFn: getDailyUsage,
        staleTime: 0,
    });

    useEffect(() => {
        if (dailyUsage) {
            setDailyUsedCount(dailyUsage.usedCount);
        }
    }, [dailyUsage]);

    // Fetch specific room to get persona info (flat response from backend)
    const { data: currentRoom } = useQuery({
        queryKey: ['room', roomId],
        queryFn: () => getChatRoom(roomId),
        staleTime: 60 * 1000,
    });

    const hasAssistantMessage = messages.some(m => m.role.toUpperCase() === 'ASSISTANT');

    // 메시지 전송 후 15초간만 추천 폴링
    const { data: roomRecommendations } = useQuery({
        queryKey: ['recommendations', roomId],
        queryFn: () => getRoomRecommendations(roomId),
        refetchInterval: () => Date.now() < recsPollUntilRef.current ? 3000 : false,
        enabled: hasAssistantMessage,
    });

    useEffect(() => {
        if (roomRecommendations && roomRecommendations.length > 0) {
            setRecommendations(roomRecommendations);
            setIsLoadingRecs(false);
        }
    }, [roomRecommendations]);

    const safeRecommendations = recommendations;

    // AI 응답 대기 중에만 2초마다 폴링, 평상시엔 자동 폴링 없음
    const { data: fetchedMessages, isLoading } = useQuery({
        queryKey: ['messages', roomId],
        queryFn: () => getMessages(roomId),
        refetchInterval: isWaiting ? 2000 : false,
    });

    useEffect(() => {
        if (fetchedMessages) {
            const sorted = [...fetchedMessages].sort((a, b) => a.timestamp - b.timestamp);
            setMessages(sorted);

            const assistantMsgs = sorted.filter(m => m.role.toUpperCase() === 'ASSISTANT');
            const assistantCount = assistantMsgs.length;

            if (prevAssistantCountRef.current === -1) {
                // 최초 로드: 기존 메시지는 애니메이션 없이 표시
                assistantMsgs.forEach(m => typedMessageIds.current.add(m.messageId));
                prevAssistantCountRef.current = assistantCount;
            } else if (assistantCount > prevAssistantCountRef.current) {
                // 새 AI 답변 도착 → 타이핑 인디케이터 제거, 추천 로딩 시작
                setIsWaiting(false);
                setIsLoadingRecs(true);
                prevAssistantCountRef.current = assistantCount;
                queryClient.invalidateQueries({ queryKey: ['recommendations', roomId] });
                setTimeout(() => setIsLoadingRecs(false), 10000);
            }
        }
    }, [fetchedMessages]);

    // 스크롤: 메시지 변경 시
    useEffect(() => {
        if (shouldScrollRef.current && scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
            shouldScrollRef.current = false;
        }
    }, [messages]);

    // 스크롤: 타이핑 인디케이터 표시 시
    useEffect(() => {
        if (isWaiting && scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [isWaiting]);

    const handleSend = async (text: string) => {
        const tempId = Date.now().toString();
        const tempMessage: Message = {
            messageId: tempId,
            role: 'USER',
            content: text,
            timestamp: Date.now()
        };
        setMessages(prev => [...prev, tempMessage]);
        shouldScrollRef.current = true;
        setIsWaiting(true);
        recsPollUntilRef.current = Date.now() + 15000; // 15초간 추천 폴링

        try {
            await sendMessage(roomId, text);
            setDailyUsedCount(prev => prev + 1);
        } catch (e) {
            console.error("Failed to send", e);
            setMessages(prev => prev.filter(m => m.messageId !== tempId));
            setIsWaiting(false);
        }
    };

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
                                <img
                                    src={currentRoom.personaImage || "/king.png"}
                                    alt={currentRoom.personaName}
                                    onError={(e) => { (e.target as HTMLImageElement).src = "/king.png"; }}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
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
                    {/* 일일 대화 횟수 배지 */}
                    <DailyLimitBadge usedCount={dailyUsedCount} />

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
                            {/* Initial greeting */}
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

                            {/* Conversation messages */}
                            {messages
                                .filter((msg, i) => !(i === 0 && msg.role.toUpperCase() === 'ASSISTANT'))
                                .map((msg, index, arr) => {
                                    const showDateSeparator = index > 0 &&
                                        new Date(msg.timestamp).getDate() !== new Date(arr[index - 1].timestamp).getDate();
                                    const lastAssistantIndex = arr.reduce((acc, m, idx) =>
                                        m.role.toUpperCase() === 'ASSISTANT' ? idx : acc, -1);
                                    const isNewMsg = msg.role.toUpperCase() === 'ASSISTANT'
                                        && index === lastAssistantIndex
                                        && !typedMessageIds.current.has(msg.messageId);
                                    return (
                                        <div key={msg.messageId}>
                                            {showDateSeparator && renderDateSeparator(msg.timestamp)}
                                            <ChatBubble
                                                message={msg}
                                                profileImageUrl={currentRoom?.personaImage}
                                                showRelated={safeRecommendations.length > 0 && msg.role.toUpperCase() === 'ASSISTANT' && index === lastAssistantIndex}
                                                showLoadingRecs={isLoadingRecs && safeRecommendations.length === 0 && msg.role.toUpperCase() === 'ASSISTANT' && index === lastAssistantIndex}
                                                onRelatedClick={() => setIsSheetOpen(true)}
                                                isNew={isNewMsg}
                                                onTypingComplete={() => typedMessageIds.current.add(msg.messageId)}
                                            />
                                        </div>
                                    );
                                })
                            }

                            {/* 타이핑 인디케이터 */}
                            {isWaiting && (
                                <TypingIndicator profileImageUrl={currentRoom?.personaImage} />
                            )}
                        </>
                    )}
                    <div ref={scrollRef} />
                </div>
            </div>

            {/* Input */}
            <ChatInput onSend={handleSend} disabled={isWaiting || dailyUsedCount >= 10} />

            <ContentBottomSheet
                isOpen={isSheetOpen}
                onClose={setIsSheetOpen}
                recommendations={safeRecommendations}
            />
        </div>
    );
}
