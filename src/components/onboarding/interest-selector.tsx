import { InterestType } from "@/types/user";
import { cn } from "@/lib/utils";

interface InterestSelectorProps {
    selected: InterestType[];
    onToggle: (interest: InterestType) => void;
}

const interests: { id: InterestType; label: string }[] = [
    { id: 'POLITICS', label: '정치/외교' },
    { id: 'MILITARY', label: '군사/전쟁' },
    { id: 'SCIENCE', label: '과학/발명' },
    { id: 'CULTURE', label: '문화/예술' },
    { id: 'PEOPLE', label: '인물/일화' },
];

export function InterestSelector({ selected, onToggle }: InterestSelectorProps) {
    return (
        <div className="flex flex-wrap gap-2">
            {interests.map((item) => {
                const isSelected = selected.includes(item.id);

                return (
                    <button
                        key={item.id}
                        type="button"
                        onClick={() => onToggle(item.id)}
                        className={cn(
                            "px-4 py-2 rounded-full border transition-all text-sm font-medium",
                            isSelected
                                ? "bg-[#A93F3F] text-white border-[#A93F3F]"
                                : "bg-[#F5F5F5] text-black border-transparent hover:bg-gray-200"
                        )}
                    >
                        {item.label}
                    </button>
                );
            })}
        </div>
    );
}
