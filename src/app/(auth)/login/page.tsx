"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Loader2, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { loginSchema, LoginFormData } from "@/lib/validations/auth";
import { login } from "@/lib/api/auth";
import { getMe } from "@/lib/api/users";
import { useAuthStore } from "@/lib/store/auth-store";

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const setAuth = useAuthStore((state) => state.setAuth);
    const setOnboarded = useAuthStore((state) => state.setOnboarded);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const msg = searchParams.get("msg");
        if (msg) setError(decodeURIComponent(msg));
    }, [searchParams]);

    const form = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const { isSubmitting } = form.formState;

    async function onSubmit(data: LoginFormData) {
        setError(null);
        try {
            const response = await login(data);
            const { accessToken, refreshToken, ...rest } = response;

            const user = {
                userId: rest.userId,
                email: rest.email,
                nickname: rest.nickname,
            };

            setAuth(user, accessToken, refreshToken);

            // Set cookie for middleware
            const secure = window.location.protocol === "https:" ? "; Secure" : "";
            document.cookie = `accessToken=${accessToken}; path=/; max-age=3600; SameSite=Lax${secure}`;

            // Skip onboarding check and go directly to home
            setOnboarded(true); // Temporarily set to true to avoid other checks
            router.push("/personas");

        } catch (err: any) {
            const msg = err?.message || "";
            if (!msg || msg === "Failed to fetch" || msg.startsWith("Unexpected")) {
                setError("서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.");
            } else {
                setError(msg);
            }
        }
    }

    return (
        <div className="space-y-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="space-y-1">
                                <div className="flex justify-between items-baseline">
                                    <FormLabel className="text-xs text-[var(--text-secondary)]">성명 (ID)</FormLabel>
                                </div>
                                <FormControl>
                                    <Input
                                        placeholder="scholar@joseon.kr"
                                        {...field}
                                        className="border-0 border-b border-[var(--border)] rounded-none px-0 focus-visible:ring-0 focus-visible:border-[var(--text-primary)]"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem className="space-y-1">
                                <div className="flex justify-between items-baseline">
                                    <FormLabel className="text-xs text-[var(--text-secondary)]">암호 (PW)</FormLabel>
                                </div>
                                <FormControl>
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        {...field}
                                        className="border-0 border-b border-[var(--border)] rounded-none px-0 focus-visible:ring-0 focus-visible:border-[var(--text-primary)]"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {error && (
                        <div className="text-[var(--destructive)] text-sm text-center py-2 bg-[var(--destructive)]/5 rounded-md">
                            {error}
                        </div>
                    )}

                    <div className="pt-4">
                        <Button
                            type="submit"
                            className="w-full bg-[var(--btn-primary)] hover:bg-[var(--btn-primary)]/90 text-white h-11"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <span className="flex items-center gap-2">
                                    입 궐 하 기 <ChevronRight className="w-4 h-4" />
                                </span>
                            )}
                        </Button>
                    </div>
                </form>
            </Form>

            {/* 구분선 */}
            <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-[var(--border)]" />
                <span className="text-xs text-[var(--text-muted)]">또는</span>
                <div className="flex-1 h-px bg-[var(--border)]" />
            </div>

            {/* 구글 로그인 버튼 */}
            <Button
                type="button"
                variant="outline"
                className="w-full h-11 border-[var(--border)] hover:bg-[var(--bg-secondary)] gap-3"
                onClick={() => {
                    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
                    if (!clientId) {
                        setError("Google Client ID is not configured.");
                        return;
                    }
                    const redirectUri = encodeURIComponent(`${window.location.origin}/callback/google`);
                    const scope = encodeURIComponent("email profile");
                    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
                }}
            >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span className="text-sm font-medium text-[var(--text-primary)]">Google로 계속하기</span>
            </Button>

            <div className="text-center text-sm text-[var(--text-muted)] space-x-3">
                <Link href="/signup" className="hover:text-[var(--text-primary)] transition-colors underline-offset-4 hover:underline">
                    회원가입
                </Link>
                <span className="text-[var(--border)]">|</span>
                <Link href="/forgot-password" className="hover:text-[var(--text-primary)] transition-colors underline-offset-4 hover:underline">
                    아이디/비밀번호 찾기
                </Link>
            </div>
        </div>
    );
}
