import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const TrendingMoviesCard = ({ trendingMovies }) => {
  return (
    <section className="mt-12">
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-4 text-xl font-semibold text-white md:text-2xl"
      >
        Trending Movies
      </motion.h2>

      <motion.ul
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex gap-4 py-4 overflow-x-auto -mx-4 px-4"
        whileTap={{ cursor: 'grabbing' }}
      >
        {trendingMovies.map((movie, index) => (
          <Link to={`movie/${movie.movie_id}`} key={movie.$id} as={`/movie/${movie.movie_id}`}>
            <motion.li
              key={movie.$id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.08 }}
              className="relative min-w-[140px] overflow-hidden rounded-xl bg-neutral-900 shadow-md md:min-w-[160px]"
            >
              {/* Rank Badge */}
              <div className="absolute left-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-xs font-bold text-white">
                {index + 1}
              </div>

              {/* Poster */}
              <img
                src={movie.poster_url.includes('null') ? '/no-movie.png' : movie.poster_url}
                alt={movie.movie_id}
                className="h-full w-full object-cover transition duration-500 hover:scale-110"
              />

              {/* Gradient Overlay */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            </motion.li>
          </Link>
        ))}
      </motion.ul>
    </section>
  );
};

export default TrendingMoviesCard;
