'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/layout/logo';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-primary)] p-4 text-center gap-6">
            <div className="opacity-50 grayscale">
                <Logo size="lg" />
            </div>

            <div className="space-y-2">
                <h2 className="text-2xl font-bold font-serif text-[var(--destructive)]">
                    통신에 문제가 발생하였습니다
                </h2>
                <p className="text-[var(--text-secondary)]">
                    서버와의 연결이 원활하지 않습니다.<br />
                    잠시 후 다시 시도해 주십시오.
                </p>
                {error.digest && (
                    <p className="text-xs text-[var(--text-muted)] font-mono mt-2">
                        Error Digest: {error.digest}
                    </p>
                )}
            </div>

            <Button
                onClick={reset}
                variant="outline"
                className="border-[var(--btn-primary)] text-[var(--btn-primary)] hover:bg-[var(--bg-secondary)]"
            >
                다시 시도하기
            </Button>
        </div>
    );
}
