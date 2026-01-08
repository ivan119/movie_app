import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SingleMovie from './pages/movie/SingleMovie';

const App = () => (
  <div>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/movie/:id" element={<SingleMovie />} />
    </Routes>
  </div>
);

export default App;
