import { useParams } from "react-router-dom";

export default function MovieDetailPage () {
    const { movieId } = useParams<{movieId: string}>();

    return (
        <div className="flex flex-col items-center justify-center h-dvh w-full bg-gray-800">
            <h1 className="font-extrabold text-4xl text-gray-200 mb-6">영화 상세 페이지입니다.</h1>
            <h1 className="font-semibold text-2xl text-yellow-200">'{movieId}'번 영화 정보를 불러왔습니다.</h1>
        </div>
    );
}
