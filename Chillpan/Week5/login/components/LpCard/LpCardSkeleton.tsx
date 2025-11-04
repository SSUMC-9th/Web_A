const LpCardSkeleton = () => {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden animate-pulse">
      {" "}
      // 깜빡깜빡
      {/* 이미지 */}
      <div className="aspect-square bg-gray-400"></div>
      {/* 텍스트 */}
      <div className="p-3 bg-gray-900">
        {/* 제목 */}
        <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
        {/* 내용 */}
        <div className="h-3 bg-gray-700 rounded w-full"></div>
      </div>
    </div>
  );
};

export default LpCardSkeleton;
