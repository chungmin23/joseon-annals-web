"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Persona } from "@/types/persona";
import { cn } from "@/lib/utils";
import { createChatRoom } from "@/lib/api/chat";

interface PersonaCardProps {
    persona: Persona;
}

export function PersonaCard({ persona }: PersonaCardProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = async () => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            const room = await createChatRoom({ personaId: persona.personaId });
            router.push(`/chat/${room.roomId}`);
        } catch (e) {
            console.error("Failed to create chat room", e);
            setIsLoading(false);
        }
    };

    const getRoleLabel = (title: string) => {
        if (title.includes("국왕") || title.includes("왕")) return "KING";
        if (title.includes("장군") || title.includes("장수")) return "GENERAL";
        if (title.includes("학자")) return "SCHOLAR";
        return "PERSONA";
    };

    const getTypeColor = (reignPeriod: string) => {
        // Simple heuristic based on reign period years
        if (reignPeriod.includes('EARLY') || parseInt(reignPeriod) < 1500) return "bg-[var(--accent-emerald)]";
        if (reignPeriod.includes('MID') || (parseInt(reignPeriod) >= 1500 && parseInt(reignPeriod) < 1700)) return "bg-[var(--accent-gold)]";
        if (reignPeriod.includes('LATE') || parseInt(reignPeriod) >= 1700) return "bg-[var(--text-primary)]";
        return "bg-gray-400";
    };

    const roleLabel = getRoleLabel(persona.title);
    const typeInitial = roleLabel[0];

    return (
        <div
            onClick={handleClick}
            className={cn(
                "block group cursor-pointer bg-white rounded-[20px] p-5 border border-[var(--border)] shadow-sm hover:shadow-md transition-all relative overflow-hidden",
                isLoading && "opacity-60 pointer-events-none"
            )}
        >
            {/* Top Row: Badges */}
            <div className="flex justify-between items-start mb-4 relative z-10">
                <span className="px-2 py-1 text-[10px] font-bold text-[var(--text-secondary)] uppercase border border-[var(--border)] rounded-md bg-white tracking-wider">
                    {persona.reignPeriod}
                </span>

                <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm",
                    getTypeColor(persona.reignPeriod)
                )}>
                    {typeInitial}
                </div>
            </div>

            {/* Centered Image */}
            <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-[var(--bg-secondary)] shadow-inner">
                {persona.profileImage ? (
                    <Image
                        src={persona.profileImage}
                        alt={persona.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                    />
                ) : (
                    <img
                        src="/king.png"
                        alt={persona.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                )}
            </div>

            {/* Bottom Info */}
            <div className="text-center relative z-10">
                <p className="text-[10px] font-bold text-[var(--accent-red)] tracking-[0.15em] uppercase mb-1">
                    {roleLabel}
                </p>
                <h3 className="text-xl font-bold font-serif text-[var(--text-primary)]">
                    {persona.name}
                </h3>
            </div>

            {/* Loading overlay */}
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-[1px] z-20">
                    <div className="w-5 h-5 border-2 border-[var(--text-primary)] border-t-transparent rounded-full animate-spin" />
                </div>
            )}
        </div>
    );
}
