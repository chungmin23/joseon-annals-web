"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, MessageSquare, BookMarked, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
    const pathname = usePathname();

    const tabs = [
        { href: "/personas", label: "인물 선택", icon: User },
        // Chat logic is tricky. Usually "Chats" list to select room. 
        // PRD says "/chat/[roomId]" is the chat room. 
        // Is there a "Chat List"? 
        // P8 Main/Home is "Persona List".
        // Does BottomNav go to "Chat List"? 
        // Looking at PRD 2.3 Component list: "BottomNav: 인물 선택 / 역사 서재 / 설정". 
        // Wait, where is Chat? Chat is entered VIA Persona.
        // So BottomNav tabs are: Personas, Library, Settings.

        // Let's check PRD again.
        // BottomNav items: 
        // 1. Personas (Home) - Icon: User or Users
        // 2. Library - Icon: Book/Bookmark
        // 3. Settings - Icon: Settings
        // Is that it?
        // "하단 고정 네비게이션 (인물 선택 / 역사 서재 / 설정)" -> Yes.

        { href: "/library", label: "역사 서재", icon: BookMarked },
        { href: "/settings", label: "설정", icon: Settings },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 h-16 bg-[var(--bg-secondary)] border-t border-[var(--border)] flex items-center justify-around pb-safe z-50">
            {tabs.map((tab) => {
                const isActive = pathname.startsWith(tab.href);
                const Icon = tab.icon;

                return (
                    <Link
                        key={tab.href}
                        href={tab.href}
                        className={cn(
                            "flex flex-col items-center justify-center gap-1 w-full h-full transition-colors",
                            isActive ? "text-[var(--accent-red)]" : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                        )}
                    >
                        <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
                        <span className="text-[10px] font-medium">{tab.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
