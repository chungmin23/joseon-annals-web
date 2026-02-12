import { EraType } from "@/types/user";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface EraSelectorProps {
    selected: EraType | undefined;
    onSelect: (era: EraType) => void;
}

const eras: { id: EraType; label: string; period: string }[] = [
    { id: 'EARLY', label: '조선 초기', period: '태조 ~ 세종' },
    { id: 'MID', label: '조선 중기', period: '성종 ~ 선조' },
    { id: 'LATE', label: '조선 후기', period: '인조 ~ 정조' },
    { id: 'END', label: '조선 말기', period: '순조 ~ 고종' }, // Assuming 'END' is a valid type, need to check types/user.ts
];

export function EraSelector({ selected, onSelect }: EraSelectorProps) {
    return (
        <div className="grid grid-cols-2 gap-3">
            {eras.map((era) => (
                <button
                    key={era.id}
                    type="button"
                    onClick={() => onSelect(era.id)}
                    className={cn(
                        "relative p-4 rounded-lg border text-left transition-all h-24 flex flex-col justify-center",
                        selected === era.id
                            ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                            : "bg-white text-black border-[var(--border)] hover:border-[#1A1A1A]"
                    )}
                >
                    <div className="flex justify-between items-start w-full">
                        <span className="font-bold text-lg">{era.label}</span>
                        {selected === era.id && (
                            <div className="bg-[#3A3A3A] rounded-full p-0.5">
                                <Check className="w-3 h-3 text-white" />
                            </div>
                        )}
                    </div>
                    <span className={cn(
                        "text-xs mt-1",
                        selected === era.id ? "text-gray-400" : "text-gray-500"
                    )}>
                        {era.period}
                    </span>
                </button>
            ))}
        </div>
    );
}
