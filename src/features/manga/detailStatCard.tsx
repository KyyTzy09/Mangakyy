
export default function Stat({ Icon, children, color }: { Icon: React.ElementType, children: React.ReactNode, color: string }) {
    return (
        <div className="flex items-center gap-1">
            <span className={`material-symbols-outlined text-base ${color}`}>
                <Icon />
            </span>
            {children}
        </div>
    )
}