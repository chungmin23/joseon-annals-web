"use client";

import { PageHeader } from "@/components/layout/page-header";
import { useAuthStore } from "@/lib/store/auth-store";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut, User as UserIcon, Bell, Shield, HelpCircle, ChevronRight } from "lucide-react";
import { logout } from "@/lib/api/auth";

export default function SettingsPage() {
    const router = useRouter();
    const { user, clearAuth, refreshToken } = useAuthStore();

    const handleLogout = async () => {
        try {
            if (refreshToken) {
                await logout(refreshToken);
            }
        } catch (e) {
            console.error("Logout failed", e);
        } finally {
            clearAuth();
            // Clear cookie
            document.cookie = "accessToken=; path=/; max-age=0; SameSite=Strict";
            router.push("/login");
        }
    };

    const menuItems = [
        { icon: Bell, label: "알림 설정", href: "#" },
        { icon: Shield, label: "개인정보 처리방침", href: "#" },
        { icon: HelpCircle, label: "고객센터", href: "#" },
    ];

    return (
        <div>
            <PageHeader label="SYSTEM" title="설정" />

            {/* Profile Section */}
            <div className="bg-white rounded-2xl p-6 border border-[var(--border)] mb-6 shadow-sm flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-muted)] border border-[var(--border)]">
                    <UserIcon className="w-8 h-8 opacity-50" />
                </div>
                <div>
                    <h2 className="text-xl font-bold font-serif text-[var(--text-primary)]">
                        {user?.nickname || "사용자"}
                    </h2>
                    <p className="text-sm text-[var(--text-secondary)]">
                        {user?.email || "user@example.com"}
                    </p>
                </div>
            </div>

            {/* Menu List */}
            <div className="space-y-3 mb-8">
                {menuItems.map((item, index) => (
                    <button
                        key={index}
                        className="w-full flex items-center justify-between p-4 bg-white rounded-xl border border-[var(--border)] hover:bg-[var(--bg-secondary)] transition-colors"
                        onClick={() => alert("준비 중인 기능입니다.")}
                    >
                        <div className="flex items-center gap-3 text-[var(--text-primary)]">
                            <item.icon className="w-5 h-5 text-[var(--text-secondary)]" />
                            <span className="font-medium">{item.label}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[var(--text-muted)]" />
                    </button>
                ))}
            </div>

            {/* Logout Button */}
            <Button
                variant="ghost"
                className="w-full text-[var(--accent-red)] hover:text-[var(--accent-red)] hover:bg-[var(--accent-red)]/5 h-12 rounded-xl border border-transparent hover:border-red-100"
                onClick={handleLogout}
            >
                <LogOut className="w-4 h-4 mr-2" />
                로그아웃
            </Button>

            <p className="text-center text-[10px] text-[var(--text-muted)] mt-6">
                버전 1.0.0
            </p>
        </div>
    );
}
