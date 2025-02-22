import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Card = () => {
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(1);
    const [hoveredMovie, setHoveredMovie] = useState(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [typedText, setTypedText] = useState(""); 
    const totalPages = 10;

    const API_URL = `https://api.themoviedb.org/3/movie/popular?api_key=242c1cb70872a139c3f09ebe6949e3da&language=en-US&page=${page}`;

    useEffect(() => {
        fetch(API_URL)
            .then((res) => res.json())
            .then((data) => {
                setMovies(data.results);
            })
            .catch((error) => console.error('Error fetching movies:', error));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [page]);

    // Update position on mouse move
    const handleMouseMove = (e) => {
        setPosition({ x: e.clientX, y: e.clientY });
    };

    // Typing animation effect
    useEffect(() => {
        if (hoveredMovie) {
            const selectedMovie = movies.find(m => m.id === hoveredMovie);
            if (selectedMovie) {
                const fullText = selectedMovie.overview ? selectedMovie.overview.slice(0, 100) + "..." : "No overview available.";
                setTypedText(""); // Reset before typing animation starts
                
                let i = 0;
                const interval = setInterval(() => {
                    if (i < fullText.length) {
                        setTypedText(prev => prev + fullText[i]);
                        i++;
                    } else {
                        clearInterval(interval);
                    }
                }, 20); // Adjust typing speed

                return () => clearInterval(interval); // Cleanup
            }
        }
    }, [hoveredMovie]);

    return (
        <div className="min-h-screen">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
                <h2 className="text-3xl font-bold tracking-tight text-black text-center">🎬 Popular Movies</h2>

                {/* Movie Cards */}
                <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                    {movies.map((movie) => (
                        <div
                            key={movie.id}
                            className="relative w-full h-96 group cursor-pointer transform transition-all duration-300 hover:scale-105"
                            onMouseEnter={(e) => {
                                setHoveredMovie(movie.id);
                                handleMouseMove(e);
                            }}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={() => {
                                setHoveredMovie(null);
                                setTypedText(""); // Reset text when hovering out
                            }}
                        >
                            <Link to={`/movie/${movie.id}`}>
                                <img
                                    alt={movie.title}
                                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                    className="w-full h-full rounded-lg object-cover shadow-xl border-2 border-gray-800"
                                />
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Cursor-Following Pop-Up with Typing Animation */}
                {hoveredMovie && (
                    <div
                        className="fixed bg-white/80 backdrop-blur-lg p-6 rounded-xl shadow-xl text-black w-80 z-50 transition-opacity duration-300"
                        style={{
                            top: position.y + 20 + "px",
                            left: position.x + 20 + "px",
                            opacity: hoveredMovie ? 1 : 0, 
                            transition: "opacity 0.3s ease-in-out",
                        }}
                    >
                        <h3 className="text-xl font-bold">{movies.find(m => m.id === hoveredMovie)?.title}</h3>
                        <p className="text-sm mt-2 text-black leading-relaxed">
                            {typedText}
                        </p>
                        <div className="mt-3 flex items-center justify-between">
                            <span className="bg-blue-600 text-white px-3 py-1 rounded-md text-xs">
                                ⭐ {movies.find(m => m.id === hoveredMovie)?.vote_average?.toFixed(1) || 'N/A'}
                            </span>
                            <span className="text-black text-xs">
                                📅 {movies.find(m => m.id === hoveredMovie)?.release_date || 'Unknown'}
                            </span>
                        </div>
                    </div>
                )}

                {/* Pagination Controls */}
                <div className="mt-12 flex justify-center space-x-3">
                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setPage(i + 1)}
                            className={`px-4 py-2 rounded-md text-white text-lg font-semibold transition-all duration-300 ${
                                page === i + 1
                                    ? 'bg-blue-600 shadow-lg scale-110'
                                    : 'bg-gray-700 hover:bg-gray-600'
                            }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Card;
