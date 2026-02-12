import { Logo } from "@/components/layout/logo";

export default function Loading() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-primary)] gap-6">
            <div className="animate-bounce">
                <Logo size="lg" />
            </div>
            <p className="text-[var(--text-muted)] font-serif animate-pulse text-lg">
                역사의 기록을 불러오는 중...
            </p>
        </div>
    );
}
