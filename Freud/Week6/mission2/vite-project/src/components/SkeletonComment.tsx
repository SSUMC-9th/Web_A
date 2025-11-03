import React from 'react';

const SkeletonComment: React.FC = () => {
    return (
        <div className="p-4 border-b border-gray-200 animate-pulse">
            <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                <div className="h-4 bg-gray-300 rounded w-24"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
    );
};

export default SkeletonComment;
