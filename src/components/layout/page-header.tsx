interface PageHeaderProps {
    label?: string;
    title: string;
    description?: string;
    rightContent?: React.ReactNode;
}

export function PageHeader({ label, title, description, rightContent }: PageHeaderProps) {
    return (
        <div className="flex items-center justify-between mb-6">
            <div>
                {label && (
                    <span className="text-[10px] font-bold text-[var(--accent-red)] tracking-[0.2em] uppercase block mb-1">
                        {label}
                    </span>
                )}
                <h1 className="text-2xl font-bold font-serif text-[var(--text-primary)]">
                    {title}
                </h1>
                {description && (
                    <p className="text-xs text-[var(--text-muted)] mt-1">
                        {description}
                    </p>
                )}
            </div>
            {rightContent && <div>{rightContent}</div>}
        </div>
    );
}
