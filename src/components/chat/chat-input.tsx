import { useState, useRef, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatInputProps {
    onSend: (message: string) => void;
    disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
    const [input, setInput] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSend = () => {
        if (input.trim() && !disabled) {
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
        <div className="fixed bottom-16 left-0 right-0 bg-[var(--bg-primary)] px-4 pb-4 pt-2 z-50 border-t border-[var(--border)]/30">
            <div className="max-w-md mx-auto flex items-end gap-3">
                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="대화를 입력하시오..."
                    className="flex-1 min-h-[40px] max-h-32 bg-transparent border-b border-[var(--border)] focus:border-[var(--text-primary)] outline-none resize-none py-2 text-base font-serif placeholder:text-[var(--text-muted)] transition-colors overflow-y-auto scrollbar-hide"
                    rows={1}
                />

                <Button
                    type="button"
                    size="icon"
                    className="w-10 h-10 rounded-full bg-[var(--text-primary)] hover:bg-[var(--text-primary)]/90 text-[var(--bg-primary)] transition-transform hover:scale-105 active:scale-95 mb-1 shrink-0"
                    onClick={handleSend}
                    disabled={!input.trim() || disabled}
                >
                    <ArrowRight className="w-5 h-5" />
                </Button>
            </div>
        </div>
    );
}
