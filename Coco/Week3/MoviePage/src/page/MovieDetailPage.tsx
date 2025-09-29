import { useParams } from "react-router-dom";

const MovieDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">Movie Detail Page</h1>
            <p className="text-lg">Movie ID: {id}</p>
        </div>
    );
}
export default MovieDetailPage;

