type Props = {
    count?: number;     // 렌더할 아이템 수
    itemHeightClass?: string;
};

export default function CardGridSkeleton ({
    count = 12,
    itemHeightClass = "h-40",
} : Props) {
    return (
        <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
            {Array.from({ length: count }).map((_, i) => (
                <li key={i} className="space-y-2">
                <div className={`w-full ${itemHeightClass} bg-gray-600 rounded`} />
                <div className="h-4 w-3/4 bg-gray-600 rounded" />
                <div className="h-4 w-1/2 bg-gray-600 rounded" />
                </li>
            ))}
        </ul>
    )
}