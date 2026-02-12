import { useRef } from "react";
import { X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { ContentCard } from "./content-card";
import { ContentItem } from "@/types/content";
import { saveToLibrary } from "@/lib/api/contents";

interface ContentBottomSheetProps {
    isOpen: boolean;
    onClose: (open: boolean) => void;
    recommendations: ContentItem[];
}

export function ContentBottomSheet({ isOpen, onClose, recommendations }: ContentBottomSheetProps) {

    const handleSave = async (id: string) => {
        try {
            await saveToLibrary(id);
            alert("서재에 담았습니다.");
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent side="bottom" showCloseButton={false} className="h-[80vh] rounded-t-3xl p-0 bg-[var(--bg-primary)] border-t border-[var(--border)]">
                {/* Drag Handle */}
                <div className="w-12 h-1.5 bg-[var(--border)] rounded-full mx-auto mt-3 mb-6" />

                <div className="px-6 pb-6 h-full flex flex-col items-start text-left">
                    <div className="w-full flex justify-between items-start mb-6">
                        <div className="space-y-1">
                            <span className="text-xs font-bold text-[var(--accent-red)] tracking-widest font-sans uppercase">
                                CONTEXT ANALYSIS
                            </span>
                            <h2 className="text-2xl font-bold font-serif text-[var(--text-primary)]">
                                관련 콘텐츠 추천
                            </h2>
                            <p className="text-sm text-[var(--text-secondary)]">
                                대화 맥락에 맞는 {Array.isArray(recommendations) ? recommendations.length : 0}가지 항목이 발견되었습니다.
                            </p>
                        </div>
                        <SheetClose className="rounded-full p-2 bg-[var(--bg-secondary)] hover:bg-[var(--border)] transition-colors">
                            <X className="w-4 h-4" />
                        </SheetClose>
                    </div>

                    <div className="flex-1 w-full overflow-y-auto">
                        <div className="grid grid-cols-2 gap-4 pb-20">
                            {Array.isArray(recommendations) && recommendations.map(item => (
                                <ContentCard
                                    key={item.contentId}
                                    content={item}
                                    onSave={handleSave}
                                    isSaved={item.isSaved}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
