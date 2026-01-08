import React, { useEffect, useState } from 'react';
import { useDebounce } from 'react-use';
import Search from './components/Search.jsx';
import MovieCard from './components/MovieCard.jsx';
import Spinner from './components/Spinner.jsx';
import { getTrendingMovies, updateSearchCount } from './appwrite.js';
import TrendingMoviesCard from './components/TrendingMoviesCard.jsx';

const { VITE_API_BASE_URL, VITE_TMDB_API_KEY } = import.meta.env;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${VITE_TMDB_API_KEY}`,
  },
};
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
          ? `${VITE_API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&sort_by=popularity.desc/`
          : `${VITE_API_BASE_URL}/discover/movie?sort_by=popularity.desc/`;
      const response = await fetch(endpoint, API_OPTIONS);
      if (!response.ok) {
        throw new Error('An error occurred while fetching movies.');
      }
      const data = await response.json();
      if (data.Response === 'False') {
        setErrorMessage('No movies found. Please try again with a different search term.');
      }
      setMoviesList(data.results || []);
      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
    } catch {
      setErrorMessage('Error fetching movies. Please try again later.');
    } finally {
      setIsLoadingState(false);
    }
  };
  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies.documents || []);
    } catch (e) {
      console.log(e);
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
      <div className="text-2xl">App</div>
      <div className="wrapper">
        <header>
          <img src="/hero-img.png" alt="Hero banner" fetchPriority="high" loading="eager" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>
        {trendingMovies?.length > 0 && <TrendingMoviesCard trendingMovies={trendingMovies} />}
        <section className="all-movies">
          <h2 className="mt-6">All Movies</h2>
          {isLoadingState ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-700">{errorMessage}</p>
          ) : (
            <ul>
              {moviesList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;
