import React from 'react';

const TrendingMoviesCard = ({ trendingMovies }) => {
  return (
    <section className="trending">
      <h2>Trending Movies</h2>
      <ul>
        {trendingMovies.map((movie, index) => (
          <li key={movie.$id}>
            <p>{index + 1}</p>
            <img src={movie.poster_url || '/no-movie.png'} alt={movie.movie_id} />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default TrendingMoviesCard;
