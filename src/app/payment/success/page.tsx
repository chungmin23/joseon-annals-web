"use client";

import { useEffect } from "react";

export default function PaymentSuccessPage() {
    useEffect(() => {
        // 부모 창에 구독 갱신 신호 전송
        if (window.opener) {
            window.opener.postMessage("payment_success", "*");
        }
        // 1.5초 후 창 닫기
        const timer = setTimeout(() => {
            window.close();
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-primary)]">
            <div className="text-center space-y-3">
                <div className="text-5xl">✓</div>
                <p className="text-lg font-bold text-[var(--text-primary)]">결제가 완료되었습니다</p>
                <p className="text-sm text-[var(--text-secondary)]">잠시 후 창이 닫힙니다...</p>
            </div>
        </div>
    );
}
