import { Logo } from "./logo";

export function AuthLayoutHeader() {
    return (
        <div className="flex flex-col items-center gap-4 mb-8">
            <div className="relative">
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-pink-200/50 rounded-full blur-xl -z-10 animate-pulse" />
                <Logo size="lg" />
            </div>
            <div className="flex items-center gap-3 w-full max-w-[240px]">
                <div className="h-px flex-1 bg-[var(--border)]" />
                <span className="text-[10px] tracking-[0.2em] text-[var(--text-muted)] font-medium">
                    JOSEON ANNALS TALK
                </span>
                <div className="h-px flex-1 bg-[var(--border)]" />
            </div>
        </div>
    );
}
