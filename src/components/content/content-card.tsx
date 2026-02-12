import Link from "next/link";
import Image from "next/image";
import { Play, BookOpen, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { ContentItem } from "@/types/content";
import { Button } from "@/components/ui/button";

interface ContentCardProps {
    content: ContentItem;
    onSave?: (id: string) => void;
    isSaved?: boolean;
}

export function ContentCard({ content, onSave, isSaved }: ContentCardProps) {
    const isVideo = content.type === 'VIDEO';

    const handleLinkClick = (e: React.MouseEvent) => {
        // Open in new tab logic is handled by Link target="_blank"
    };

    return (
        <div className="flex flex-col w-full group">
            <div className="relative aspect-video rounded-xl overflow-hidden mb-2 border border-[var(--border)] bg-[var(--bg-secondary)] shadow-sm">
                {/* Thumbnail */}
                {content.thumbnailUrl ? (
                    <Image
                        src={content.thumbnailUrl}
                        alt={content.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-[var(--border)]/20 text-[var(--text-muted)]">
                        {isVideo ? <Play className="w-8 h-8 opacity-20" /> : <BookOpen className="w-8 h-8 opacity-20" />}
                    </div>
                )}

                {/* Badge & Overlays */}
                <div className="absolute top-2 left-2 z-10">
                    {isVideo ? (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-[var(--accent-red)] text-white shadow-sm">
                            VIDEO
                        </span>
                    ) : (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold rounded border bg-white/90 border-[var(--text-primary)] text-[var(--text-primary)]">
                            BOOK
                        </span>
                    )}
                </div>

                {isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white backdrop-blur-sm">
                            <Play className="w-4 h-4 fill-white ml-0.5" />
                        </div>
                    </div>
                )}

                {isVideo && content.videoDuration && (
                    <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/70 text-white text-[10px] font-medium backdrop-blur-sm">
                        {content.videoDuration}
                    </div>
                )}
            </div>

            {/* Info */}
            <h3 className="text-sm font-bold line-clamp-2 mb-0.5 leading-tight">{content.title}</h3>
            <p className="text-xs text-[var(--text-secondary)] mb-2 line-clamp-1">{content.description}</p>

            {/* Actions */}
            <div className="mt-auto space-y-2">
                {/* External Link CTA */}
                <Link href={content.linkUrl} target="_blank" rel="noopener noreferrer" className="w-full">
                    <Button
                        variant="default"
                        size="sm"
                        className={cn(
                            "w-full h-8 text-xs font-bold text-white",
                            isVideo
                                ? "bg-[var(--accent-red)] hover:bg-[var(--accent-red)]/90"
                                : "bg-[var(--accent-green)] hover:bg-[var(--accent-green)]/90"
                        )}
                    >
                        {isVideo ? "YouTube 시청" : "네이버 도서"}
                    </Button>
                </Link>

                {/* Save CTA */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSave && !isSaved && onSave(content.contentId)}
                    disabled={isSaved}
                    className={cn(
                        "w-full h-8 text-xs border-[var(--border)]",
                        isSaved
                            ? "bg-[var(--border)]/20 text-[var(--text-muted)] hover:bg-[var(--border)]/20"
                            : "text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
                    )}
                >
                    {isSaved ? (
                        <span className="flex items-center gap-1">
                            <Check className="w-3 h-3" /> 이미 담겨있습니다
                        </span>
                    ) : "내 서재에 담기"}
                </Button>
            </div>
        </div>
    );
}
