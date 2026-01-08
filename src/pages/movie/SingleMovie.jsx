import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const { VITE_API_BASE_URL, VITE_TMDB_API_KEY } = import.meta.env;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${VITE_TMDB_API_KEY}`,
  },
};

const SingleMovie = () => {
  const { id } = useParams();

  // State management
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getMovieById = async (movieId) => {
    try {
      setLoading(true);
      setError(null); // Reset error state before new fetch

      const response = await fetch(`${VITE_API_BASE_URL}/movie/${movieId}`, API_OPTIONS);

      if (!response.ok) {
        throw new Error(`The resource you requested could not be found.`);
      }

      const data = await response.json();
      setMovie(data);
    } catch (e) {
      console.error(e);
      setError(e.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      getMovieById(id);
    }
  }, [id]);

  // Conditional Rendering logic
  if (loading) return <div className="mt-10 text-center">Loading movie details...</div>;

  if (error)
    return (
      <div className="mt-10 text-center text-red-500">
        <p className="mb-4">{error}</p>
        <Link to="/" className="px-4 py-2 bg-blue-500 text-white rounded">
          Back to Home
        </Link>
      </div>
    );

  if (!movie) return <div className="mt-10 text-center">No movie found.</div>;

  return (
    <div className="p-10 text-white">
      <h1 className="font-bold">{movie.title}</h1>
      <p className="mt-4 text-gray-600">{movie.overview}</p>
      <div className="mt-6">
        <span className="font-semibold ">Release Date:</span> {movie.release_date}
      </div>
      <div className="mt-2">
        <span className="font-semibold">Rating:</span> {movie.vote_average} / 10
      </div>
    </div>
  );
};

export default SingleMovie;
