import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

export const LatestRelease = () => {
    
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(1); // Track current page
    const totalPages = 10; // Set a max limit for pagination
    const API_URL = `https://api.themoviedb.org/3/movie/now_playing?api_key=242c1cb70872a139c3f09ebe6949e3da&language=en-US&page=${page}`;
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        setMovies(data.results);
        console.log(data.results);
      })
      .catch((error) => console.error('Error fetching movies:', error));
      window.scrollTo({ top: 0, behavior: 'smooth' });

  }, [page]);
  return (
    <div className="bg-white">
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
      <h2 className="text-2xl font-bold tracking-tight text-gray-900">🎟️ Latest Releases
</h2>

      <div className="mt-6 grid grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-3 lg:grid-cols-4 xl:gap-x-2">
        {movies.map((movie) => (
          <div key={movie.id} className="group relative m-auto">
            <Link to={`/movie/${movie.id}`}>

            <img
              alt={movie.title}
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              className="w-full h-[400px] object-cover rounded-lg"
            />
            <div className="mt-2 text-center">
              <h3 className="text-sm font-medium text-gray-900">{movie.title}</h3>
              <p className="text-sm text-gray-500">⭐ {movie.vote_average}</p>
            </div>
            </Link>
          </div>
        ))}
      </div>
      <div className="mt-8 flex justify-center space-x-2">
                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setPage(i + 1) }
                            className={`px-3 py-1 rounded-md cursor-pointer ${
                                page === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-300 hover:bg-gray-400'
                              }`}                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
    </div>
  </div>
  )
}
