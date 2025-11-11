import { useNavigate } from "react-router-dom";

type Props = {
  id: number;
  title: string;
  thumbnail: string;
  createdAt?: string | Date;
  likesCount?: number;
};

const LPCard = ({ id, title, thumbnail, createdAt, likesCount }: Props) => {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate(`/lp/${id}`)} className="group relative text-left">
      <div className="overflow-hidden rounded-md">
        <img
          src={thumbnail}
          alt={title}
          loading="lazy"
          onError={(e) => {
            const img = e.currentTarget as HTMLImageElement;
            if (img.src !== "https://placehold.co/600x600?text=No+Image") {
              img.src = "https://placehold.co/600x600?text=No+Image";
            }
          }}
          className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="absolute inset-0 rounded-md bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
        <div className="text-xs text-white/90 w-full">
          <div className="font-medium line-clamp-1">{title}</div>
          <div className="text-[10px] text-zinc-200/80 flex gap-2">
            {createdAt && <span>{new Date(createdAt).toLocaleDateString()}</span>}
            {typeof likesCount === "number" && <span>❤ {likesCount}</span>}
          </div>
        </div>
      </div>
    </button>
  );
};

export default LPCard;
