"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { PersonaCard } from "@/components/persona/persona-card";
import { Persona } from "@/types/persona";
import { getPersonas } from "@/lib/api/personas";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

// Dummy data for fallback/demonstration
const DUMMY_PERSONAS: Persona[] = [
    {
        personaId: 1,
        name: "세종",
        reignPeriod: "1418-1450",
        title: "제4대 국왕",
        description: "한글을 창제하고 과학 기술을 발전시킨 성군. 백성을 사랑하는 마음으로 소통합니다.",
        profileImage: "",
        tags: ["성군", "한글", "과학"],
    },
    {
        personaId: 2,
        name: "정조",
        reignPeriod: "1776-1800",
        title: "제22대 국왕",
        description: "수원 화성을 건설하고 탕평책을 펼친 개혁 군주. 실학을 바탕으로 새로운 조선을 꿈꿉니다.",
        profileImage: "",
        tags: ["개혁", "효심", "화성"],
    },
    {
        personaId: 3,
        name: "영조",
        reignPeriod: "1724-1776",
        title: "제21대 국왕",
        description: "탕평책을 통해 당쟁을 잠재우려 노력했던 군주. 엄격하지만 나라를 생각하는 마음은 깊습니다.",
        profileImage: "",
        tags: ["탕평", "최장수", "엄격"],
    },
    {
        personaId: 4,
        name: "태종",
        reignPeriod: "1400-1418",
        title: "제3대 국왕",
        description: "왕권을 강화하고 조선의 기틀을 다진 군주. 강력한 리더십으로 난세를 평정합니다.",
        profileImage: "",
        tags: ["왕권", "결단", "기틀"],
    },
];

export default function PersonasPage() {
    const [search, setSearch] = useState("");
    const [currentTab, setCurrentTab] = useState<"ALL" | "EARLY" | "MID" | "LATE">("ALL");

    const getEra = (reignPeriod: string) => {
        const startYear = parseInt(reignPeriod);
        if (isNaN(startYear)) return "";
        if (startYear < 1500) return "EARLY";
        if (startYear < 1700) return "MID";
        return "LATE";
    };

    const { data: requestPersonas, isLoading } = useQuery({
        queryKey: ['personas', currentTab],
        queryFn: () => getPersonas(currentTab !== "ALL" ? currentTab : undefined),
        retry: false
    });

    const usingDummy = !requestPersonas || requestPersonas.length === 0;
    const personas = usingDummy ? DUMMY_PERSONAS : requestPersonas;

    // Filter logic — era filter applied to dummy fallback, search applied always
    const filteredPersonas = personas.filter(p => {
        if (usingDummy && currentTab !== "ALL" && getEra(p.reignPeriod) !== currentTab) return false;
        if (search) {
            return (
                p.name.includes(search) ||
                (p.tags && p.tags.some(t => t.includes(search))) ||
                (p.title && p.title.includes(search))
            );
        }
        return true;
    });

    // Mock recommendation (e.g., first 3 items or specific IDs)
    const recommendedPersonas = personas.slice(0, 2);

    return (
        <div className="pb-20">
            <PageHeader label="THE ROYAL RECORDS" title="위인 선택" description="기록 속의 인물을 깨워 대화를 나누어 보십시오." />

            {/* Tabs */}
            <div className="flex gap-6 border-b border-[var(--border)] mb-6 px-1 overflow-x-auto scrollbar-hide">
                {[
                    { id: "ALL", label: "전체" },
                    { id: "EARLY", label: "조선 초기" },
                    { id: "MID", label: "조선 중기" },
                    { id: "LATE", label: "조선 후기" },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setCurrentTab(tab.id as any)}
                        className={`pb-3 text-sm font-medium transition-colors whitespace-nowrap ${currentTab === tab.id
                            ? "text-[var(--text-primary)] border-b-2 border-[var(--text-primary)]"
                            : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Recommended Section (Only show on ALL tab and no search) */}
            {currentTab === "ALL" && !search && (
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <h2 className="text-lg font-bold font-serif text-[var(--text-primary)]">오늘의 추천 위인</h2>
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-red)]" />
                    </div>

                    <div className="flex gap-4 overflow-x-auto pb-4 -mx-5 px-5 scrollbar-hide">
                        {recommendedPersonas.map(persona => (
                            <div key={persona.personaId} className="w-[160px] flex-shrink-0">
                                <PersonaCard persona={persona} />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Main List Section */}
            <div className="mb-4">
                <div className="flex justify-between items-end mb-4">
                    <h2 className="text-lg font-bold font-serif text-[var(--text-primary)]">
                        {search ? "검색 결과" : "전체 목록"}
                    </h2>
                </div>

                {/* Search Input - embedded in section or distinct */}
                <div className="relative mb-6">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                        <Search className="w-4 h-4" />
                    </div>
                    <Input
                        placeholder="위인 이름 또는 키워드 검색"
                        className="pl-9 bg-white border-[var(--border)] rounded-xl h-11"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {isLoading && !requestPersonas ? (
                        Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="aspect-[3/4] rounded-[20px] bg-[var(--border)]/30 animate-pulse" />
                        ))
                    ) : filteredPersonas.length > 0 ? (
                        filteredPersonas.map((persona) => (
                            <PersonaCard key={persona.personaId} persona={persona} />
                        ))
                    ) : (
                        <div className="col-span-2 py-10 text-center text-[var(--text-muted)]">
                            검색 결과가 없습니다.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
