import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import IngredientList from '../components/IngredientList';

const Ingredients = () => {
  return (
    <div className="min-h-screen bg-orange-300 flex items-center justify-center p-6">
      <div className="bg-white p-10 rounded-lg shadow-xl max-w-4xl w-full">
        <div className="flex justify-between items-center mb-4">
          <Link to="/" className="text-lg font-medium text-gray-700 hover:text-gray-900 flex items-center">
            <FontAwesomeIcon icon={faHome} className="mr-2" /> Home
          </Link>
          <h1 className="text-4xl font-bold text-center text-gray-800">Ingredients</h1>
          <div className="w-16"></div> 
        </div>
        <p className="text-center text-lg text-gray-600 mb-8">Discover the ingredients and in which francesinhas they are used.</p>
        <IngredientList />
      </div>
    </div>
  );
}

export default Ingredients;
