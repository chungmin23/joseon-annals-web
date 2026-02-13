"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Mail, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forgotPassword } from "@/lib/api/auth";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            await forgotPassword(email);
            setSent(true);
        } catch (err: any) {
            setError(err?.message || "요청에 실패했습니다. 잠시 후 다시 시도해주세요.");
        } finally {
            setIsLoading(false);
        }
    };

    if (sent) {
        return (
            <div className="space-y-6 text-center">
                <div className="space-y-1">
                    <h1 className="text-xl font-bold font-serif text-[var(--text-primary)]">전갈을 발송하였습니다</h1>
                    <p className="text-xs text-[var(--text-muted)]">가입하신 이메일을 확인해 주세요.</p>
                    <div className="h-px w-8 bg-[var(--border)] mx-auto mt-3" />
                </div>

                <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-5 py-4 space-y-1 text-left">
                    <p className="text-sm font-medium text-[var(--text-primary)]">임시 비밀번호가 발송되었습니다</p>
                    <p className="text-xs text-[var(--text-secondary)]">
                        <span className="font-semibold">{email}</span> 으로 임시 비밀번호를 보냈습니다.
                        이메일을 받지 못하셨다면 스팸함을 확인해 주세요.
                    </p>
                </div>

                <p className="text-[10px] text-[var(--text-muted)]">
                    로그인 후 설정에서 비밀번호를 변경해 주세요.
                </p>

                <Button
                    className="w-full bg-[var(--btn-primary)] hover:bg-[var(--btn-primary)]/90 text-white h-10"
                    onClick={() => router.push('/login')}
                >
                    로그인 하러 가기
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="text-center space-y-1">
                <h1 className="text-xl font-bold font-serif text-[var(--text-primary)]">신원 확인 (身元確認)</h1>
                <p className="text-xs text-[var(--text-muted)]">가입하신 전자우편으로 임시 비밀번호를 보냅니다.</p>
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
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="scholar@joseon.kr"
                            className="pl-9 h-10 border-[var(--border)] focus-visible:ring-[var(--accent-red)] focus-visible:border-[var(--accent-red)]"
                        />
                    </div>
                </div>

                {error && (
                    <p className="text-xs text-center text-[var(--destructive)] bg-[var(--destructive)]/5 border border-[var(--destructive)]/20 rounded-lg px-3 py-2">
                        {error}
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
                        disabled={isLoading}
                        className="bg-[var(--accent-red)] hover:bg-[var(--accent-red)]/90 text-white h-10"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "전갈 보내기 →"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
