import { BottomNav } from "@/components/layout/bottom-nav";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen pb-16 bg-[var(--bg-primary)]">
            {/* Background Texture Overlay */}
            <div
                className="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-multiply z-0"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }}
            />
            <main className="relative z-10 p-4 max-w-md mx-auto min-h-screen">
                {children}
            </main>
            <BottomNav />
        </div>
    );
}
