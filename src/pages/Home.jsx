import React, { useEffect, useState } from 'react';
import { useDebounce } from 'react-use';
import Search from '/src/components/Search.jsx';
import MovieCard from '/src/components/MovieCard.jsx';
import Spinner from '/src/components/Spinner.jsx';
import TrendingMoviesCard from '/src/components/TrendingMoviesCard.jsx';
import { getTrendingMovies, updateSearchCount } from '/src/appwrite.js';
import { motion, AnimatePresence } from 'framer-motion';
import MovieCardSkeleton from '/src/components/MovieCardSkeleton.jsx';

import { apiClient } from '/src/services/api';

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [moviesList, setMoviesList] = useState([]);
  const [isLoadingState, setIsLoadingState] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [trendingMovies, setTrendingMovies] = useState([]);

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  const fetchMovies = async (query = '') => {
    setIsLoadingState(true);
    setErrorMessage('');

    try {
      const endpoint =
        query && query.length > 2
          ? `/search/movie?query=${encodeURIComponent(query)}&sort_by=popularity.desc`
          : `/discover/movie?sort_by=popularity.desc`;

      // Use the centralized utility
      const data = await apiClient(endpoint);

      setMoviesList(data.results || []);

      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      setErrorMessage(error.message || 'Error fetching movies. Please try again later.');
    } finally {
      setIsLoadingState(false);
    }
  };

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies.documents || []);
    } catch (e) {
      console.error('Trending fetch error:', e);
    }
  };

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  return (
    <main>
      <div className="pattern"></div>
      <div className="wrapper">
        <header>
          <img src="/hero-img.png" alt="Hero banner" fetchPriority="high" loading="eager" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {trendingMovies?.length > 0 && <TrendingMoviesCard trendingMovies={trendingMovies} />}

        <section className="all-movies mt-10">
          <h2 className="mb-4">All Movies</h2>

          <div className="min-h-[600px]">
            {' '}
            {/* CLS FIX */}
            <AnimatePresence mode="wait">
              {isLoadingState ? (
                <motion.ul
                  key="skeleton"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
                >
                  {Array.from({ length: 10 }).map((_, i) => (
                    <MovieCardSkeleton key={i} />
                  ))}
                </motion.ul>
              ) : errorMessage ? (
                <p className="text-red-700">{errorMessage}</p>
              ) : (
                <motion.ul
                  key="movies"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
                >
                  {moviesList.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </section>
      </div>
    </main>
  );
};

export default App;
