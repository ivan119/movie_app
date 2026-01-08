import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const MovieCard = ({
  movie: { id, title, vote_average, poster_path, original_language, release_date },
}) => {
  return (
    <motion.li
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={{ scale: 1.05 }}
      className="group"
    >
      <Link
        to={`/movie/${id}`}
        className="block overflow-hidden rounded-2xl bg-neutral-900 shadow-md transition hover:shadow-xl"
      >
        {/* Poster */}
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}` : '/no-movie.png'}
            alt={title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
          />

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 transition group-hover:opacity-100" />
        </div>

        {/* Content */}
        <div className="p-4 text-white">
          <h3 className="line-clamp-1 text-sm font-semibold md:text-base">{title}</h3>

          <div className="mt-2 flex items-center gap-2 text-xs text-white/70">
            {/* Rating */}
            <div className="flex items-center gap-1">
              <img src="/star.svg" alt="Star Icon" className="h-3 w-3" />
              <span>{vote_average ? vote_average.toFixed(1) : 'N/A'}</span>
            </div>

            <span>•</span>

            {/* Language */}
            <span className="uppercase">{original_language || 'N/A'}</span>

            <span>•</span>

            {/* Year */}
            <span>{release_date ? release_date.split('-')[0] : 'N/A'}</span>
          </div>
        </div>
      </Link>
    </motion.li>
  );
};

export default MovieCard;
