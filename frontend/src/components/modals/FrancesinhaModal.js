import React, { useState, useEffect } from 'react';
import CustomButton from '../ui/Button';
import CustomInput from '../ui/Input';
import axios from 'axios';
import Select from 'react-select';

const FrancesinhaModal = ({ francesinha, isOpen, onClose, onDone, mode }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [rating, setRating] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurants, setSelectedRestaurants] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && francesinha) {
        setName(francesinha.name);
        setPrice(francesinha.price);
        setRating(francesinha.rating);
        setSelectedIngredients(francesinha.Ingredients.map(i => ({ value: i.id, label: i.name })));
        setPhotos(JSON.parse(francesinha.photos));
        setSelectedRestaurants(francesinha.Restaurants.map(r => ({ value: r.id, label: r.name })));
      } else {
        setBlankValues();
      }
      const fetchRestaurants = async () => {
        try {
          const response = await axios.get('/restaurants');
          setRestaurants(response.data.rows);
        } catch (error) {
          console.error('Error fetching restaurants:', error);
        }
      };
      fetchRestaurants();
      const fetchIngredients = async () => {
        try {
          const response = await axios.get('/ingredients');
          setIngredients(response.data.rows);
        } catch (error) {
          console.error('Error fetching ingredients:', error);
        }
      };
      fetchIngredients();
    }
  }, [francesinha, isOpen, mode]);

  const setBlankValues = () => {
    setName('');
    setPrice('');
    setRating('');
    setSelectedIngredients([]);
    setPhotos([]);
    setSelectedRestaurants([]);
    setErrors({});
  };

  const validate = () => {
    const newErrors = {};

    if (!name || name.length < 3 || name.length > 100) {
      newErrors.name = 'Invalid Name, use 3-100 characters';
    }
    if (!price || price < 0.01 || price > 1000) {
      newErrors.price = 'Price validation failed, allowed range 0.01-1000';
    }
    if (!rating || rating < 1 || rating > 5) {
      newErrors.rating = 'Rating validation failed, allowed range 1-5';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }
    const francesinhaData = {
      name,
      price: parseFloat(price),
      rating: parseFloat(rating),
      ingredients: selectedIngredients.map(f => f.value),
      photos: photos,
      restaurants: selectedRestaurants.map(f => f.value),
    };
    if (mode === 'edit') {
      francesinhaData.id = francesinha.id;
    }
    onDone(francesinhaData);
    handleClose();
  };

  const handleClose = () => { 
    setBlankValues(); 
    onClose(); 
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" onClick={handleClose}>
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl mb-4">{mode === 'edit' ? 'Edit Francesinha' : 'Create New Francesinha'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <CustomInput
              label="Name"
              error={errors.name}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <CustomInput
              label="Price"
              error={errors.price}
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              min="0.01"
              max="1000"
              step="0.01"
            />
          </div>
          <div className="mb-4">
            <CustomInput
              label="Rating"
              error={errors.rating}
              type="number"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              required
              min="1"
              max="5"
              step="0.1"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Photos</label>
            <input 
              id="photos" 
              type="file" 
              className="block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-primary-500 file:py-2.5 file:px-4 file:text-sm file:font-semibold file:text-white hover:file:bg-primary-700 focus:outline-none disabled:pointer-events-none disabled:opacity-60"
              multiple
              onChange={(e) => setPhotos([...e.target.files])}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Ingredients</label>
            <Select
              isMulti
              options={ingredients.map(f => ({ value: f.id, label: f.name }))}
              value={selectedIngredients}
              onChange={setSelectedIngredients}
              className="w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Restaurants</label>
            <Select
              isMulti
              options={restaurants.map(f => ({ value: f.id, label: f.name }))}
              value={selectedRestaurants}
              onChange={setSelectedRestaurants}
              className="w-full"
            />
          </div>
          <div className="flex justify-end">
            <CustomButton type="button" onClick={handleClose} className="bg-red-500 hover:bg-red-700" text="Cancel"/>
            <CustomButton type="submit" className="bg-blue-500 hover:bg-blue-700" text={mode === 'edit' ? 'Save' : 'Create'}/>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FrancesinhaModal;
