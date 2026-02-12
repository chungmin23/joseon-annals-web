import { CommunicationStyle } from "@/types/user";
import { cn } from "@/lib/utils";

interface StyleSelectorProps {
    selected: CommunicationStyle | undefined;
    onSelect: (style: CommunicationStyle) => void;
}

const styles: { id: CommunicationStyle; label: string; subLabel?: string }[] = [
    { id: 'EASY', label: '쉽고\n친근하게' },
    { id: 'NORMAL', label: '적당한\n깊이로', subLabel: '일반적인 대화' },
    { id: 'HARD', label: '학술적으로\n깊게' },
];

export function StyleSelector({ selected, onSelect }: StyleSelectorProps) {
    return (
        <div className="grid grid-cols-3 gap-3">
            {styles.map((style) => (
                <button
                    key={style.id}
                    type="button"
                    onClick={() => onSelect(style.id)}
                    className={cn(
                        "relative p-3 rounded-lg border text-center transition-all h-28 flex flex-col items-center justify-center gap-1",
                        selected === style.id
                            ? "bg-[#EBE5D5] border-[#C5A572] text-black"
                            : "bg-white border-[var(--border)] text-black hover:border-gray-400"
                    )}
                >
                    <span className="font-bold whitespace-pre-line leading-tight">{style.label}</span>
                    {style.subLabel && (
                        <span className="text-[10px] text-gray-500 mt-1">{style.subLabel}</span>
                    )}
                </button>
            ))}
        </div>
    );
}
