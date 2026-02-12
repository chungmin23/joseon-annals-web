import { cn } from "@/lib/utils";

interface LogoProps {
    className?: string;
    size?: "sm" | "md" | "lg";
}

export function Logo({ className, size = "md" }: LogoProps) {
    const sizeClasses = {
        sm: "text-xl",
        md: "text-2xl",
        lg: "text-4xl",
    };

    return (
        <div className={cn("flex items-center gap-2 font-serif font-bold text-[var(--accent-red)]", sizeClasses[size], className)}>
            <div className="relative flex items-center justify-center w-[1.2em] h-[1.2em] border-2 border-[var(--accent-red)] rotate-45 bg-white shadow-sm">
                <span className="-rotate-45 text-[0.6em] font-black leading-none text-[var(--accent-red)]">
                    實<br />錄
                </span>
            </div>
            <span className="text-[var(--text-primary)] tracking-tight">조선실록톡</span>
            <div className="w-2 h-2 rounded-full bg-[var(--accent-red)]/20 ml-1 animate-pulse" />
        </div>
    );
}
