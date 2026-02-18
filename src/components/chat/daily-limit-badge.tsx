"use client";

const DAILY_LIMIT = 10;

// 엽전(葉錢) SVG: 둥근 동전 + 가운데 사각 구멍
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
            {/* 외곽 원 */}
            <circle
                cx="10"
                cy="10"
                r="9"
                fill={filled ? "#B8860B" : "transparent"}
                stroke={filled ? "#8B6508" : "#C5B58A"}
                strokeWidth="1.5"
            />
            {/* 동전 테두리 음각 선 */}
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
            {/* 가운데 사각 구멍 (엽전 특징) */}
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
}

export function DailyLimitBadge({ usedCount }: DailyLimitBadgeProps) {
    const remaining = Math.max(0, DAILY_LIMIT - usedCount);
    const isExhausted = remaining === 0;

    return (
        <div className="flex flex-col items-center gap-1.5 py-3">
            {/* 엽전 행 */}
            <div className="flex items-center gap-1">
                {Array.from({ length: DAILY_LIMIT }, (_, i) => (
                    <EopjeonCoin key={i} filled={i < usedCount} />
                ))}
            </div>

            {/* 텍스트 */}
            <p
                className="text-[11px] font-serif"
                style={{ color: isExhausted ? "var(--accent-red)" : "var(--text-muted)" }}
            >
                {isExhausted
                    ? "오늘의 대화를 모두 사용하였습니다"
                    : `오늘의 대화 · ${remaining}회 남음`}
            </p>
        </div>
    );
}
