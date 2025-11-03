import React from 'react';

const SkeletonCard: React.FC = () => {
    return (
        <div className="aspect-square overflow-hidden rounded-lg bg-gray-200 animate-pulse">
            <div className="w-full h-full"></div>
        </div>
    );
};

export default SkeletonCard;
