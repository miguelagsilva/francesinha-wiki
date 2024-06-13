import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Francesinhas from './pages/Francesinhas';
import Restaurants from './pages/Restaurants';
import Ingredients from './pages/Ingredients';
import './index.css';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/francesinhas" element={<Francesinhas />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/ingredients" element={<Ingredients />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
