"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { googleLogin } from "@/lib/api/auth";
import { useAuthStore } from "@/lib/store/auth-store";

export default function GoogleCallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const setAuth = useAuthStore((state) => state.setAuth);
    const setOnboarded = useAuthStore((state) => state.setOnboarded);
    const called = useRef(false);

    useEffect(() => {
        if (called.current) return;
        called.current = true;

        const code = searchParams.get("code");
        if (!code) {
            router.replace("/login");
            return;
        }

        const redirectUri = `${window.location.origin}/callback/google`;

        googleLogin(code, redirectUri)
            .then((response) => {
                const { accessToken, refreshToken, ...rest } = response;
                setAuth(
                    { userId: rest.userId, email: rest.email, nickname: rest.nickname },
                    accessToken,
                    refreshToken
                );
                document.cookie = `accessToken=${accessToken}; path=/; max-age=3600; SameSite=Strict`;
                setOnboarded(true);
                router.replace("/personas");
            })
            .catch((err: any) => {
                const msg = encodeURIComponent(err?.message || "구글 로그인에 실패했습니다.");
                router.replace(`/login?error=google&msg=${msg}`);
            });
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--accent-red)]" />
            <p className="text-sm text-[var(--text-secondary)]">구글 로그인 처리 중...</p>
        </div>
    );
}
