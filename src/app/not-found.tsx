import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/logo";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-primary)] p-4 text-center gap-6">
            <div className="opacity-50 grayscale">
                <Logo size="lg" />
            </div>

            <div className="space-y-2">
                <h2 className="text-3xl font-bold font-serif text-[var(--text-primary)]">
                    기록을 찾을 수 없습니다
                </h2>
                <p className="text-[var(--text-secondary)]">
                    요청하신 페이지는 소실되었거나 존재하지 않는 기록입니다.
                </p>
            </div>

            <div className="h-px w-24 bg-[var(--border)] my-4" />

            <Button asChild className="bg-[var(--btn-primary)] hover:bg-[var(--btn-primary)]/90 text-[var(--bg-secondary)]">
                <Link href="/">
                    한양으로 돌아가기
                </Link>
            </Button>
        </div>
    );
}
