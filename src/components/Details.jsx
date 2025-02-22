import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const Details = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [images, setImages] = useState([]);
  const [trailer, setTrailer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_KEY = '242c1cb70872a139c3f09ebe6949e3da';
  const MOVIE_DETAILS_URL = `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`;
  const MOVIE_IMAGES_URL = `https://api.themoviedb.org/3/movie/${id}/images?api_key=${API_KEY}`;
  const MOVIE_TRAILER_URL = `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}&language=en-US`;

  useEffect(() => {
    Promise.all([
      fetch(MOVIE_DETAILS_URL).then((res) => res.json()),
      fetch(MOVIE_IMAGES_URL).then((res) => res.json()),
      fetch(MOVIE_TRAILER_URL).then((res) => res.json()),
    ])
      .then(([movieData, imagesData, trailerData]) => {
        if (movieData.success === false) throw new Error('Movie not found');
        setMovie(movieData);
        setImages(imagesData.backdrops.slice(0, 6)); // Show up to 6 images
        
        // Find the first YouTube trailer
        const officialTrailer = trailerData.results.find(video => video.type === "Trailer" && video.site === "YouTube");
        setTrailer(officialTrailer ? officialTrailer.key : null);
        
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching movie details:', error);
        setError(error.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="text-center text-gray-500 py-10">Loading...</div>;
  if (error) return <div className="text-center text-red-500 py-10">Error: {error}</div>;

  return (
    <div className="min-h-screen text-gray-900 px-4 py-10">
      {/* Movie Details */}
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* Poster Image */}
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="w-80 rounded-lg shadow-lg"
        />

        {/* Movie Info */}
        <div className="flex-1">
          <h1 className="text-4xl font-bold">{movie.title}</h1>
          <p className="text-gray-600 text-lg mt-2 text-justify">{movie.overview}</p>

          {/* Ratings & Release Date */}
          <div className="mt-4 flex flex-wrap items-center gap-4 text-gray-700">
            <span className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm">
              ⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
            </span>
            <span className="bg-gray-300 px-3 py-1 rounded-md text-sm">
              📅 {movie.release_date || 'Unknown'}
            </span>
          </div>

          {/* Genres */}
          <div className="mt-6 flex flex-wrap gap-2">
            {movie.genres?.length > 0 ? (
              movie.genres.map((genre) => (
                <span key={genre.id} className="bg-gray-200 px-3 py-1 rounded-full text-sm">
                  {genre.name}
                </span>
              ))
            ) : (
              <span className="text-gray-400">No genres available</span>
            )}
          </div>
        </div>
      </div>

      {/* Trailer Section */}
      {trailer && (
        <div className="mt-10 max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Movie Trailer</h2>
          <div className="aspect-w-16 aspect-h-9">
            <iframe
              width="100%"
              height="400"
              src={`https://www.youtube.com/embed/${trailer}`}
              title="Movie Trailer"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg shadow-lg w-full"
            ></iframe>
          </div>
        </div>
      )}

      {/* Multiple Movie Images */}
      <div className="mt-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((img, index) => (
            <img
              key={index}
              src={`https://image.tmdb.org/t/p/w500${img.file_path}`}
              alt={`Movie Image ${index + 1}`}
              className="rounded-lg shadow-lg"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Details;
