// components/lp/LpCard.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Lp } from '../../types/lp.types';

interface LpCardProps {
  lp: Lp;
}

export const LpCard = ({ lp }: LpCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      className="relative cursor-pointer rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/lp/${lp.id}`)}
    >
      <img 
        src={lp.thumbnail} 
        alt={lp.title}
        className="w-full h-64 object-cover"
      />
      
      {isHovered && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col justify-end p-4 text-white">
          <h3 className="text-lg font-bold mb-2">{lp.title}</h3>
          <div className="flex gap-4 text-sm">
            <span>{new Date(lp.uploadDate).toLocaleDateString()}</span>
            <span>❤️ {lp.likes}</span>
          </div>
        </div>
      )}
    </div>
  );
};