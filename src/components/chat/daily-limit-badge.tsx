"use client";

function EopjeonCoin({ filled }: { filled: boolean }) {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <circle
                cx="10"
                cy="10"
                r="9"
                fill={filled ? "#B8860B" : "transparent"}
                stroke={filled ? "#8B6508" : "#C5B58A"}
                strokeWidth="1.5"
            />
            {filled && (
                <circle
                    cx="10"
                    cy="10"
                    r="7"
                    fill="none"
                    stroke="#8B6508"
                    strokeWidth="0.6"
                    opacity="0.5"
                />
            )}
            <rect
                x="7.5"
                y="7.5"
                width="5"
                height="5"
                rx="0.5"
                fill={filled ? "#7A5500" : "#E0D8CC"}
                stroke={filled ? "#5C3D00" : "#C5B58A"}
                strokeWidth="0.8"
            />
        </svg>
    );
}

interface DailyLimitBadgeProps {
    usedCount: number;
    limitCount: number;
}

export function DailyLimitBadge({ usedCount, limitCount }: DailyLimitBadgeProps) {
    const remaining = Math.max(0, limitCount - usedCount);
    const isExhausted = remaining === 0;

    return (
        <div className="flex w-full items-center justify-center gap-2 py-3">
            <div className="flex items-center">
                <EopjeonCoin filled={usedCount > 0} />
            </div>

            <p
                className="text-[11px] font-serif text-center"
                style={{ color: isExhausted ? "var(--accent-red)" : "var(--text-muted)" }}
            >
                {isExhausted
                    ? "오늘의 대화를 모두 사용했습니다."
                    : `오늘의 대화 · ${remaining}회 남음`}
            </p>
        </div>
    );
}
