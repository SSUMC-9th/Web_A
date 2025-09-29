const HomePage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">    
            <h1 className="text-4xl font-bold mb-8 text-white">Welcome to Movie Explorer</h1>
            <p className="text-lg text-gray-300 mb-4">Discover and explore movies from around the world.</p>
            <a 
                href="/movies" 
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
                Explore Movies
            </a>
        </div>
    );
}

export default HomePage;