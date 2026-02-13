"use client";

import { PageHeader } from "@/components/layout/page-header";
import { useAuthStore } from "@/lib/store/auth-store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { LogOut, User as UserIcon, Bell, Shield, HelpCircle, ChevronRight, Lock, Loader2, CheckCircle } from "lucide-react";
import { logout, changePassword } from "@/lib/api/auth";

export default function SettingsPage() {
    const router = useRouter();
    const { user, clearAuth, refreshToken } = useAuthStore();

    const [sheetOpen, setSheetOpen] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleLogout = async () => {
        try {
            if (refreshToken) {
                await logout(refreshToken);
            }
        } catch (e) {
            console.error("Logout failed", e);
        } finally {
            clearAuth();
            document.cookie = "accessToken=; path=/; max-age=0; SameSite=Strict";
            router.push("/login");
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (newPassword !== confirmPassword) {
            setError("새 비밀번호가 일치하지 않습니다.");
            return;
        }
        if (newPassword.length < 6) {
            setError("새 비밀번호는 6자 이상이어야 합니다.");
            return;
        }
        setIsLoading(true);
        try {
            await changePassword(currentPassword, newPassword);
            setSuccess(true);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err: any) {
            setError(err?.message || "비밀번호 변경에 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSheetClose = (open: boolean) => {
        if (!open) {
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setError(null);
            setSuccess(false);
        }
        setSheetOpen(open);
    };

    const menuItems = [
        { icon: Lock, label: "비밀번호 변경", onClick: () => setSheetOpen(true) },
        { icon: Bell, label: "알림 설정", onClick: () => alert("준비 중인 기능입니다.") },
        { icon: Shield, label: "개인정보 처리방침", onClick: () => alert("준비 중인 기능입니다.") },
        { icon: HelpCircle, label: "고객센터", onClick: () => alert("준비 중인 기능입니다.") },
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
                        onClick={item.onClick}
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

            {/* 비밀번호 변경 Sheet */}
            <Sheet open={sheetOpen} onOpenChange={handleSheetClose}>
                <SheetContent side="bottom" className="rounded-t-2xl px-6 pb-8">
                    <SheetHeader className="mb-6">
                        <SheetTitle className="text-lg font-bold font-serif text-[var(--text-primary)]">
                            비밀번호 변경 (密字更新)
                        </SheetTitle>
                        <div className="h-px w-8 bg-[var(--border)]" />
                    </SheetHeader>

                    {success ? (
                        <div className="flex flex-col items-center gap-4 py-6">
                            <CheckCircle className="w-12 h-12 text-green-500" />
                            <p className="text-sm font-medium text-[var(--text-primary)]">비밀번호가 변경되었습니다</p>
                            <Button
                                className="w-full bg-[var(--btn-primary)] hover:bg-[var(--btn-primary)]/90 text-white h-10"
                                onClick={() => handleSheetClose(false)}
                            >
                                닫기
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleChangePassword} className="space-y-4">
                            <div className="space-y-1.5">
                                <Label className="text-xs text-[var(--text-secondary)]">현재 비밀번호</Label>
                                <Input
                                    required
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="현재 비밀번호 입력"
                                    className="h-10 border-[var(--border)] focus-visible:ring-[var(--accent-red)] focus-visible:border-[var(--accent-red)]"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs text-[var(--text-secondary)]">새 비밀번호</Label>
                                <Input
                                    required
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="새 비밀번호 (6자 이상)"
                                    className="h-10 border-[var(--border)] focus-visible:ring-[var(--accent-red)] focus-visible:border-[var(--accent-red)]"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs text-[var(--text-secondary)]">새 비밀번호 확인</Label>
                                <Input
                                    required
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="새 비밀번호 재입력"
                                    className="h-10 border-[var(--border)] focus-visible:ring-[var(--accent-red)] focus-visible:border-[var(--accent-red)]"
                                />
                            </div>

                            {error && (
                                <p className="text-xs text-center text-[var(--destructive)] bg-[var(--destructive)]/5 border border-[var(--destructive)]/20 rounded-lg px-3 py-2">
                                    {error}
                                </p>
                            )}

                            <div className="grid grid-cols-2 gap-3 pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="border-[var(--border)] text-[var(--text-secondary)] h-10"
                                    onClick={() => handleSheetClose(false)}
                                >
                                    취소
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="bg-[var(--accent-red)] hover:bg-[var(--accent-red)]/90 text-white h-10"
                                >
                                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "변경하기"}
                                </Button>
                            </div>
                        </form>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    );
}
