"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
    const setAuth = useAuthStore((state) => state.setAuth);
    const setOnboarded = useAuthStore((state) => state.setOnboarded);
    const [error, setError] = useState<string | null>(null);

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
            document.cookie = `accessToken=${accessToken}; path=/; max-age=3600; SameSite=Strict`;

            // Skip onboarding check and go directly to home
            setOnboarded(true); // Temporarily set to true to avoid other checks
            router.push("/personas");

        } catch (err: any) {
            if (err.message === "INVALID_CREDENTIALS") {
                setError("성명 또는 암호가 올바르지 않습니다.");
            } else {
                setError(err.message || "로그인에 실패하였습니다.");
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
