"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [notice, setNotice] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setNotice("현재 지원되지 않는 기능입니다. 추후 업데이트 예정입니다.");
    };

    return (
        <div className="space-y-6">
            <div className="text-center space-y-1">
                <h1 className="text-xl font-bold font-serif text-[var(--text-primary)]">신원 확인 (身元確認)</h1>
                <p className="text-xs text-[var(--text-muted)]">가입하신 전자우편으로 정보를 보냅니다.</p>
                <div className="h-px w-8 bg-[var(--border)] mx-auto mt-3" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <div className="flex justify-between items-baseline">
                        <Label className="text-xs text-[var(--accent-red)] font-medium">전자우편 (Email)</Label>
                    </div>

                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                            <Mail className="w-4 h-4" />
                        </div>
                        <Input
                            required
                            type="email"
                            placeholder="scholar@joseon.kr"
                            className="pl-9 h-10 border-[var(--border)] focus-visible:ring-[var(--accent-red)] focus-visible:border-[var(--accent-red)]"
                        />
                    </div>
                </div>

                {notice && (
                    <p className="text-xs text-center text-[var(--text-secondary)] bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-3 py-2">
                        {notice}
                    </p>
                )}

                <div className="grid grid-cols-2 gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        className="border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] h-10"
                        onClick={() => router.push('/login')}
                    >
                        돌아가기
                    </Button>
                    <Button
                        type="submit"
                        className="bg-[var(--accent-red)] hover:bg-[var(--accent-red)]/90 text-white h-10"
                    >
                        전갈 보내기 →
                    </Button>
                </div>
            </form>
        </div>
    );
}
