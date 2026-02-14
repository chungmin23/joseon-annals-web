"use client";

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

    return (
        <div
            onClick={handleClick}
            className={cn(
                "group cursor-pointer rounded-[20px] overflow-hidden shadow-sm hover:shadow-md transition-all relative aspect-square",
                isLoading && "opacity-60 pointer-events-none"
            )}
        >
            <img
                src={persona.profileImage || "/king.png"}
                alt={persona.name}
                onError={(e) => { (e.target as HTMLImageElement).src = "/king.png"; }}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />

            {/* Loading overlay */}
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-[1px] z-20">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
            )}
        </div>
    );
}
