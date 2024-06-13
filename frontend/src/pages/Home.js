import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; 

const Home = () => {
  return (
    <div className="min-h-screen bg-orange-300 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8 bg-white p-10 rounded-lg shadow-2xl">
        <h1 className="text-5xl font-extrabold text-center text-gray-900 mb-6">Francesinha Wiki</h1>
        <p className="text-center text-xl text-gray-600 mb-8">Welcome! Discover the best restaurants and francesinhas around the world.</p>
        <div className="flex flex-col sm:flex-row justify-around items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link to="/francesinhas" className="group block bg-blue-600 rounded-lg shadow-lg transform transition hover:scale-105 w-48 h-48 flex flex-col items-center justify-center">
            <span className="text-6xl">🥪</span>
            <div className="text-lg font-semibold text-center text-white mt-2">Francesinhas</div>
          </Link>
          <Link to="/restaurants" className="group block bg-green-600 rounded-lg shadow-lg transform transition hover:scale-105 w-48 h-48 flex flex-col items-center justify-center">
            <span className="text-6xl">🏠</span>
            <div className="text-lg font-semibold text-center text-white mt-2">Restaurants</div>
          </Link>
          <Link to="/ingredients" className="group block bg-red-600 rounded-lg shadow-lg transform transition hover:scale-105 w-48 h-48 flex flex-col items-center justify-center">
            <span className="text-6xl">🥦</span>
            <div className="text-lg font-semibold text-center text-white mt-2">Ingredients</div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
