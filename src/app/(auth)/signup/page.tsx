"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Check } from "lucide-react";

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
import { signupSchema, SignupFormData } from "@/lib/validations/auth";
import { signup } from "@/lib/api/auth";
import { useAuthStore } from "@/lib/store/auth-store";

export default function SignupPage() {
    const router = useRouter();
    const setAuth = useAuthStore((state) => state.setAuth);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            nickname: "",
            email: "",
            password: "",
            passwordConfirm: "",
        },
    });

    const { isSubmitting } = form.formState;

    async function onSubmit(data: SignupFormData) {
        setError(null);
        try {
            const response = await signup({
                email: data.email,
                password: data.password,
                nickname: data.nickname,
            });

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

            // Skip onboarding and go directly to home
            // We might want to set isOnboarded=true in store too if needed, but login handles it.
            // Let's set it here just in case.
            useAuthStore.getState().setOnboarded(true);
            router.push("/personas");
        } catch (err: any) {
            if (err.message === "DUPLICATE") {
                setError("이미 사용 중인 전자우편입니다.");
            } else {
                setError(err.message || "회원가입에 실패하였습니다.");
            }
        }
    }

    return (
        <div className="space-y-6">
            <div className="text-center space-y-1">
                <h1 className="text-xl font-bold font-serif text-[var(--text-primary)]">입적 (入籍)</h1>
                <p className="text-xs text-[var(--text-muted)]">새로운 기록을 위해 이름을 올립니다.</p>
                <div className="h-px w-8 bg-[var(--border)] mx-auto mt-3" />
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                    <FormField
                        control={form.control}
                        name="nickname"
                        render={({ field }) => (
                            <FormItem className="space-y-1">
                                <FormLabel className="text-xs text-[var(--text-secondary)]">성명 (ID)</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="new_scholar"
                                        {...field}
                                        className="h-9 font-sans"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="space-y-1">
                                <FormLabel className="text-xs text-[var(--text-secondary)]">전자우편 (Email)</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="scholar@joseon.kr"
                                        {...field}
                                        className="h-9 font-sans"
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
                                <FormLabel className="text-xs text-[var(--text-secondary)]">암호 (PW)</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        placeholder="8자 이상"
                                        {...field}
                                        className="h-9 font-sans"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="passwordConfirm"
                        render={({ field }) => (
                            <FormItem className="space-y-1">
                                <FormLabel className="text-xs text-[var(--text-secondary)]">암호 확인</FormLabel>
                                <div className="relative">
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="암호 재입력"
                                            {...field}
                                            className="h-9 font-sans pr-10"
                                        />
                                    </FormControl>
                                    {field.value && field.value === form.getValues('password') && (
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--accent-emerald)]">
                                            <Check className="w-4 h-4" />
                                        </div>
                                    )}
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {error && (
                        <div className="text-[var(--destructive)] text-xs text-center py-2 bg-[var(--destructive)]/5 rounded-md">
                            {error}
                        </div>
                    )}

                    <div className="pt-4 grid grid-cols-3 gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            className="col-span-1 border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] h-10"
                            onClick={() => router.push('/login')}
                        >
                            취소
                        </Button>
                        <Button
                            type="submit"
                            className="col-span-2 bg-[var(--btn-primary)] hover:bg-[var(--btn-primary)]/90 text-white h-10"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                "등록하기"
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
