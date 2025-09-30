import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div className="text-center p-20">    
            <h1 className="text-4xl font-bold mb-4">Welcome to Movie App</h1>
            <p className="text-gray-600 mb-8">영화를 검색하고 정보를 확인하세요</p>
            <Link 
                to="/movies" 
                className="bg-blue-500 text-white px-6 py-3 rounded inline-block hover:bg-blue-600"
            >
                영화 보러가기
            </Link>
        </div>
    );
}

export default HomePage;