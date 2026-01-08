import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

const { VITE_API_BASE_URL, VITE_TMDB_API_KEY } = import.meta.env;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${VITE_TMDB_API_KEY}`,
  },
};

const TMDB_IMG = 'https://image.tmdb.org/t/p/w500';
const TMDB_BG = 'https://image.tmdb.org/t/p/original';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

const SingleMovie = () => {
  const { id } = useParams();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getMovieById = async (movieId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${VITE_API_BASE_URL}/movie/${movieId}`, API_OPTIONS);

      if (!response.ok) {
        throw new Error('The resource you requested could not be found.');
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
    if (id) getMovieById(id);
  }, [id]);

  if (loading) return <div className="mt-20 text-center text-white">Loading movie details...</div>;

  if (error)
    return (
      <div className="mt-20 text-center text-red-500">
        <p className="mb-4">{error}</p>
        <Link to="/" className="rounded-lg bg-blue-500 px-4 py-2 text-white">
          Back to Home
        </Link>
      </div>
    );

  if (!movie) return <div className="mt-20 text-center text-white">No movie found.</div>;

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative min-h-screen w-full overflow-hidden text-white"
    >
      {/* Backdrop */}
      <motion.div
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="absolute inset-0 -z-10"
      >
        <img
          src={`${TMDB_BG}${movie.backdrop_path}`}
          alt={movie.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/20" />
      </motion.div>

      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[300px_1fr]">
          {/* Poster */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="overflow-hidden rounded-2xl shadow-xl"
          >
            <img
              src={`${TMDB_IMG}${movie.poster_path}`}
              alt={movie.title}
              className="h-full w-full object-cover"
            />
          </motion.div>

          {/* Content */}
          <div className="flex flex-col justify-between">
            <div>
              <motion.h1 variants={itemVariants} className="text-3xl font-bold md:text-4xl">
                {movie.title}
              </motion.h1>

              {movie.tagline && (
                <motion.p variants={itemVariants} className="mt-2 text-sm italic text-white/70">
                  {movie.tagline}
                </motion.p>
              )}

              {/* Meta */}
              <motion.div
                variants={itemVariants}
                className="mt-4 flex flex-wrap items-center gap-4 text-sm text-white/80"
              >
                <span>⭐ {movie.vote_average?.toFixed(1)} / 10</span>
                <span>🕒 {movie.runtime} min</span>
                <span>📅 {movie.release_date}</span>
              </motion.div>

              {/* Genres */}
              <motion.div variants={itemVariants} className="mt-4 flex flex-wrap gap-2">
                {movie.genres?.map((genre) => (
                  <span
                    key={genre.id}
                    className="rounded-full bg-white/10 px-3 py-1 text-xs backdrop-blur"
                  >
                    {genre.name}
                  </span>
                ))}
              </motion.div>

              {/* Overview */}
              <motion.p
                variants={itemVariants}
                className="mt-6 max-w-3xl text-sm leading-relaxed text-white/90 md:text-base"
              >
                {movie.overview}
              </motion.p>
            </div>

            {/* Footer */}
            <motion.div
              variants={itemVariants}
              className="mt-8 flex flex-wrap gap-4 text-sm text-white/70"
            >
              {movie.production_countries?.length > 0 && (
                <span>🌍 {movie.production_countries.map((c) => c.name).join(', ')}</span>
              )}
              {movie.spoken_languages?.length > 0 && (
                <span>🗣 {movie.spoken_languages.map((l) => l.english_name).join(', ')}</span>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default SingleMovie;
