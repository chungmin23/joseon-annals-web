import { useState, useRef, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatInputProps {
    onSend: (message: string) => void;
    disabled?: boolean;
    isExhausted?: boolean;
    dailyLimit?: number;
}

function getTomorrowDateString() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toLocaleDateString("ko-KR", {
        month: "long",
        day: "numeric",
    });
}

function ExhaustedNotice({ dailyLimit = 10 }: { dailyLimit?: number }) {
    return (
        <div className="flex flex-col items-center gap-2 py-3">
            {/* 엽전 아이콘 행 (모두 소진 상태) */}
            <div className="flex items-center gap-0.5">
                {Array.from({ length: dailyLimit }, (_, i) => (
                    <svg key={i} width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <circle cx="10" cy="10" r="9" fill="#C8996020" stroke="#C5B58A" strokeWidth="1.5" />
                        <rect x="7.5" y="7.5" width="5" height="5" rx="0.5" fill="#E0D8CC" stroke="#C5B58A" strokeWidth="0.8" />
                    </svg>
                ))}
            </div>
            {/* 메시지 */}
            <div className="text-center">
                <p className="text-[13px] font-serif font-medium" style={{ color: "var(--accent-red)" }}>
                    오늘의 엽전을 모두 사용하셨습니다
                </p>
                <p className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>
                    {getTomorrowDateString()} 자정에 엽전이 다시 충전됩니다
                </p>
            </div>
        </div>
    );
}

export function ChatInput({ onSend, disabled, isExhausted, dailyLimit = 10 }: ChatInputProps) {
    const [input, setInput] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSend = () => {
        if (input.trim() && !disabled && !isExhausted) {
            onSend(input);
            setInput("");
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [input]);

    return (
        <div className="fixed bottom-16 left-0 right-0 bg-bg-primary px-4 pb-4 pt-2 z-50 border-t border-(--border)/30">
            <div className="max-w-md mx-auto">
                {isExhausted ? (
                    <ExhaustedNotice dailyLimit={dailyLimit} />
                ) : (
                    <div className="flex items-end gap-3">
                        <textarea
                            ref={textareaRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="대화를 입력하시오..."
                            className="flex-1 min-h-10 max-h-32 bg-transparent border-b border-border focus:border-text-primary outline-none resize-none py-2 text-base font-serif placeholder:text-text-muted transition-colors overflow-y-auto scrollbar-hide"
                            rows={1}
                        />
                        <Button
                            type="button"
                            size="icon"
                            className="w-10 h-10 rounded-full bg-text-primary hover:bg-(--text-primary)/90 text-bg-primary transition-transform hover:scale-105 active:scale-95 mb-1 shrink-0"
                            onClick={handleSend}
                            disabled={!input.trim() || disabled}
                        >
                            <ArrowRight className="w-5 h-5" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
