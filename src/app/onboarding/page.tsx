"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ChevronRight, ScrollText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EraSelector } from "@/components/onboarding/era-selector";
import { InterestSelector } from "@/components/onboarding/interest-selector";
import { StyleSelector } from "@/components/onboarding/style-selector";

import { updatePreferences } from "@/lib/api/users";
import { useAuthStore } from "@/lib/store/auth-store";
import { UserPreferences } from "@/types/user";

export default function OnboardingPage() {
    const router = useRouter();
    const setOnboarded = useAuthStore((state) => state.setOnboarded);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [preferences, setPreferences] = useState<UserPreferences>({
        preferredEra: undefined,
        interests: [],
        communicationStyle: undefined,
    });

    const isFormValid = () => {
        return (
            !!preferences.preferredEra &&
            preferences.interests && preferences.interests.length > 0 &&
            !!preferences.communicationStyle
        );
    };

    const handleSubmit = async () => {
        if (!isFormValid()) return;

        setIsSubmitting(true);
        try {
            await updatePreferences(preferences);
            setOnboarded(true);
            router.push("/personas");
        } catch (error) {
            console.error("Onboarding failed:", error);
            alert("선호도 저장에 실패하였습니다. 다시 시도해 주세요.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col items-center relative">
            {/* Header */}
            <div className="w-full max-w-md pt-12 pb-6 px-6 text-center space-y-1 relative">
                <p className="text-[10px] font-bold text-[#A93F3F] tracking-widest mb-2">ONBOARDING</p>
                <h1 className="text-3xl font-black font-serif text-[#1A1A1A]">
                    입궐 준비 (入闕準備)
                </h1>
                <p className="text-xs text-[#6B6B6B] pt-1">
                    맞춤형 대화를 위해 사관님의 취향을 여쭙니다.
                </p>

                {/* Decoration Icon */}
                <div className="absolute top-10 right-6 opacity-20">
                    <ScrollText className="w-16 h-16" strokeWidth={1} />
                </div>
            </div>

            <main className="w-full max-w-md flex-1 flex flex-col px-6 pb-24 space-y-10">

                {/* Question 1 */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="w-1 h-4 bg-[#B8860B]" />
                        <h2 className="text-lg font-bold text-[#1A1A1A]">1. 어떤 시대에 관심이 있으신가요?</h2>
                    </div>
                    <EraSelector
                        selected={preferences.preferredEra}
                        onSelect={(era) => setPreferences(prev => ({ ...prev, preferredEra: era }))}
                    />
                </section>

                {/* Question 2 */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="w-1 h-4 bg-[#A93F3F]" />
                        <h2 className="text-lg font-bold text-[#1A1A1A]">2. 어떤 분야가 흥미로우신가요?</h2>
                    </div>
                    <InterestSelector
                        selected={preferences.interests || []}
                        onToggle={(interest) => {
                            const current = preferences.interests || [];
                            const updated = current.includes(interest)
                                ? current.filter(i => i !== interest)
                                : [...current, interest];
                            setPreferences(prev => ({ ...prev, interests: updated }));
                        }}
                    />
                </section>

                {/* Question 3 */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="w-1 h-4 bg-[#1A1A1A]" />
                        <h2 className="text-lg font-bold text-[#1A1A1A]">3. 선호하는 대화 스타일은요?</h2>
                    </div>
                    <StyleSelector
                        selected={preferences.communicationStyle}
                        onSelect={(style) => setPreferences(prev => ({ ...prev, communicationStyle: style }))}
                    />
                </section>

            </main>

            {/* Footer Button */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[var(--bg-primary)] via-[var(--bg-primary)] to-transparent z-10">
                <div className="max-w-md mx-auto">
                    <Button
                        size="lg"
                        className="w-full bg-[#1A1A1A] hover:bg-black text-white shadow-lg text-lg h-14 rounded-md font-bold"
                        onClick={handleSubmit}
                        disabled={!isFormValid() || isSubmitting}
                    >
                        {isSubmitting ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                            <span className="flex items-center gap-1">
                                기록 시작하기 <ChevronRight className="w-5 h-5" />
                            </span>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
