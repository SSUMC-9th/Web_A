type Props = {
    lines?: number;
    className?: string;
};

export default function LinesSkeleton({ lines = 8, className = ""} : Props) {
    return (
        <ul className={`space-y-3 animate-pulse ${className}`}>
            {Array.from({ length: lines }).map((_, i) => (
                <li key={i} className="h-6 bg-gray-600 rounded" />
            ))}
        </ul>
    )
}