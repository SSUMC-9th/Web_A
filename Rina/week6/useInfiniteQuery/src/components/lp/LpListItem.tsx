import { useState } from "react";
import type { LpClient } from "../../types/lp"

type Props = {
    lp: LpClient;
    onClick: () => void;
};

export default function LpListItem({lp, onClick} : Props) {
    const [loaded, setLoaded] = useState(false);

    return (
        <li
            className="relative rounded overflow-hidden cursor-pointer group"
            onClick={onClick}
            title={lp.title}
        >
            {/* 이미지 로딩 전 스켈레톤 */}
            {!loaded && (
                <div className="w-full h-40 bg-gray-700 animate-pulse rounded" />
            )}

            {/* 이미지 */}
            {lp.thumbnailUrl && (
                <img
                    src={lp.thumbnailUrl}
                    alt={lp.title}
                    className={`w-full h-40 object-cover transition-opacity duration-300 ${
                        loaded ? "opacity-100" : "opacity-0"
                    }`}
                    onLoad={() => setLoaded(true)}
                />
            )}

            {/* 썸네일 없는 경우 */}
            {!lp.thumbnailUrl && (
                <div className="w-full h-40 bg-gray-800" />
            )}


            <div className="absolute inset-x-0 bottom-0 p-3 text-white opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/60 to-transparent">
                <h3 className="font-semibold line-clamp-1">{lp.title}</h3>
                <p className="text-sm opacity-90">
                    {new Date(lp.createdAt).toLocaleDateString()} · ❤ {lp.likes}
                </p>
            </div>
        </li>
    )
}