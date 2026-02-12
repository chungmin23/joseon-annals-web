export interface StepIndicatorProps {
    currentStep: number;
    totalSteps: number;
}

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
    return (
        <div className="flex items-center justify-center gap-2 mb-8">
            {Array.from({ length: totalSteps }).map((_, index) => {
                const step = index + 1;
                const isActive = step === currentStep;
                const isCompleted = step < currentStep;

                return (
                    <div key={index} className="flex items-center">
                        <div
                            className={`
                    w-2 h-2 rounded-full transition-all duration-300
                    ${isActive ? "bg-[var(--accent-red)] w-6 scale-110" : ""}
                    ${isCompleted ? "bg-[var(--accent-red)]/40" : ""}
                    ${!isActive && !isCompleted ? "bg-[var(--border)]" : ""}
                `}
                        />
                    </div>
                );
            })}
        </div>
    );
}
