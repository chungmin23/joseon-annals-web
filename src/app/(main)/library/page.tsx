"use client";

import { PageHeader } from "@/components/layout/page-header";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getLibraryContents, deleteFromLibrary } from "@/lib/api/contents";
import { ContentCard } from "@/components/content/content-card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bookmark, Play, BookOpen, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

export default function LibraryPage() {
    const [activeTab, setActiveTab] = useState("ALL");
    const queryClient = useQueryClient();

    const { data: contents = [], isLoading } = useQuery({
        queryKey: ['library'],
        queryFn: () => getLibraryContents(),
    });

    const deleteMutation = useMutation({
        mutationFn: (contentId: string) => deleteFromLibrary(contentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['library'] });
        },
    });

    const filteredContents = contents.filter(item => {
        if (activeTab === "ALL") return true;
        return item.type === activeTab;
    });

    return (
        <div className="pb-20">
            <PageHeader label="MY RECORD" title="역사 서재" />

            <Tabs defaultValue="ALL" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3 mb-6 bg-[var(--bg-secondary)] p-1 rounded-xl h-11">
                    <TabsTrigger value="ALL" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[var(--text-primary)] text-[var(--text-muted)] text-xs font-medium">
                        전체
                    </TabsTrigger>
                    <TabsTrigger value="VIDEO" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[var(--text-primary)] text-[var(--text-muted)] text-xs font-medium gap-1 flex items-center justify-center">
                        <Play className="w-3 h-3" /> 영상
                    </TabsTrigger>
                    <TabsTrigger value="BOOK" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[var(--text-primary)] text-[var(--text-muted)] text-xs font-medium gap-1 flex items-center justify-center">
                        <BookOpen className="w-3 h-3" /> 도서
                    </TabsTrigger>
                </TabsList>

                <div className="grid grid-cols-2 gap-4">
                    {isLoading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="aspect-video rounded-xl bg-[var(--border)]/30 animate-pulse" />
                        ))
                    ) : filteredContents.length > 0 ? (
                        filteredContents.map((item) => (
                            <div key={item.contentId} className="relative">
                                <ContentCard content={item} isSaved={true} />
                                <button
                                    onClick={() => deleteMutation.mutate(item.contentId)}
                                    disabled={deleteMutation.isPending}
                                    className="absolute top-2 right-2 z-10 p-1 rounded-full bg-white/90 border border-[var(--border)] shadow-sm text-[var(--text-muted)] hover:text-[var(--accent-red)] transition-colors disabled:opacity-50"
                                    title="서재에서 제거"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-2 py-10 text-center text-[var(--text-muted)] flex flex-col items-center gap-2">
                            <Bookmark className="w-8 h-8 opacity-20" />
                            <p className="text-sm">보관된 콘텐츠가 없습니다.</p>
                        </div>
                    )}
                </div>
            </Tabs>
        </div>
    );
}
