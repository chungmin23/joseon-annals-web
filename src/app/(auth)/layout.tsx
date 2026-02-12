import { AuthLayoutHeader } from "@/components/layout/auth-layout-header";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[var(--bg-primary)]">
            {/* Background Texture Overlay (Hanji effect) */}
            <div
                className="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-multiply"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }}
            />

            <div className="w-full max-w-[400px] flex flex-col relative z-10">
                <AuthLayoutHeader />

                <main className="bg-[var(--bg-secondary)]/80 backdrop-blur-sm rounded-xl border border-[var(--border)] shadow-sm p-6 sm:p-8">
                    {children}
                </main>

                <footer className="mt-8 text-center text-[10px] text-[var(--text-muted)] tracking-wider">
                    COPYRIGHT (c) JOSEON DYNASTY ARCHIVES
                </footer>
            </div>
        </div>
    );
}
