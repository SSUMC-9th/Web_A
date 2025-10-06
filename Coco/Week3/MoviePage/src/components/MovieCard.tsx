// import { useNavigate } from "react-router-dom";
// import type { Movie } from "../types/movie";

// interface MovieCardProps {
//     movie: Movie;
// }

// export default function MovieCard({ movie }: MovieCardProps) {
//     const navigate = useNavigate();

//     return (
//         <div
//             onClick={() => navigate(`/movies/${movie.id}`)}
//             className="cursor-pointer border rounded overflow-hidden hover:shadow-lg"
//         >
//             <img
//                 src={
//                     movie.poster_path 
//                         ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
//                         : 'https://via.placeholder.com/500x750?text=No+Image'
//                 }
//                 alt={movie.title}
//                 className="w-full"
//             />
//             <div className="p-3">
//                 <h3 className="font-bold text-sm mb-1">{movie.title}</h3>
//                 <p className="text-xs text-gray-600">
//                     ⭐ {movie.vote_average.toFixed(1)}
//                 </p>
//             </div>
//         </div>
//     );
// }