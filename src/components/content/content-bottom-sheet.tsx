import { useState } from "react";
import { X, BookMarked } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { ContentCard } from "./content-card";
import { ContentItem } from "@/types/content";
import { saveToLibrary } from "@/lib/api/contents";

interface ContentBottomSheetProps {
    isOpen: boolean;
    onClose: (open: boolean) => void;
    recommendations: ContentItem[];
}

export function ContentBottomSheet({ isOpen, onClose, recommendations }: ContentBottomSheetProps) {
    const [savedIds, setSavedIds] = useState<Set<number>>(new Set());
    const [toastVisible, setToastVisible] = useState(false);

    const handleSave = async (id: number) => {
        try {
            await saveToLibrary(id.toString());
            setSavedIds(prev => new Set(prev).add(id));
            setToastVisible(true);
            setTimeout(() => setToastVisible(false), 2500);
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
                            <SheetTitle className="text-2xl font-bold font-serif text-[var(--text-primary)]">
                                관련 콘텐츠 추천
                            </SheetTitle>
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
                                    isSaved={item.isSaved || savedIds.has(item.contentId)}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* 저장 완료 토스트 */}
                <div className={`
                    absolute bottom-8 left-1/2 -translate-x-1/2
                    flex items-center gap-2 px-4 py-2.5
                    bg-[#2a2a2a] text-white text-sm font-medium rounded-full shadow-lg
                    transition-all duration-300
                    ${toastVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}
                `}>
                    <BookMarked className="w-4 h-4 text-[var(--accent-gold)]" />
                    서재에 담았습니다
                </div>
            </SheetContent>
        </Sheet>
    );
}
