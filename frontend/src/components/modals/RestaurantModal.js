import React, { useState, useEffect } from 'react';
import CustomButton from '../ui/Button';
import CustomInput from '../ui/Input';
import axios from 'axios';
import Select from 'react-select';

const RestaurantModal = ({ restaurant, isOpen, onClose, onDone, mode }) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [rating, setRating] = useState('');
  const [francesinhas, setFrancesinhas] = useState([]);
  const [selectedFrancesinhas, setSelectedFrancesinhas] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && restaurant) {
        setName(restaurant.name);
        setAddress(restaurant.address);
        setCity(restaurant.city);
        setCountry(restaurant.country);
        setRating(restaurant.rating);
        setSelectedFrancesinhas(restaurant.Francesinhas.map(f => ({ value: f.id, label: f.name })));
      } else {
        setBlankValues();
      }

      const fetchFrancesinhas = async () => {
        try {
          const response = await axios.get('/francesinhas')
          setFrancesinhas(response.data.rows);
        } catch (error) {
          console.error('Error fetching francesinhas:', error);
        }
      };
      fetchFrancesinhas();
    }
  }, [restaurant, isOpen, mode]);

  const setBlankValues = () => {
    setName('');
    setAddress('');
    setCity('');
    setCountry('');
    setRating('');
    setSelectedFrancesinhas([]);
    setErrors('');
  };

  const validate = () => {
    const newErrors = {};

    if (!name || name.length < 3 || name.length > 100) {
      newErrors.name = 'Invalid Name, use 3-100 characters';
    }
    if (!address || /^\d+$/.test(address)) {
      newErrors.address = 'Invalid address';
    }
    if (!city || !/^[a-zA-Z\s]+$/.test(city) || city.length < 3 || city.length > 100) {
      newErrors.city = 'Letters only, 3-100 characters';
    }
    if (!country || !/^[a-zA-Z\s]+$/.test(country) || country.length < 3 || country.length > 100) {
      newErrors.country = 'Letters only, 3-100 characters';
    }
    if (!rating || rating < 1 || rating > 5) {
      newErrors.rating = 'Ration validation failed, allowed range 1-5';
    }
    console.log("New Errors:", newErrors);

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }
    const restaurantData = {
      name,
      address,
      city,
      country,
      rating: parseFloat(rating),
      francesinhas: selectedFrancesinhas.map(f => f.value),
    };
    if (restaurant !== null) restaurantData.id = restaurant.id;
    onDone(restaurantData);
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
        <h2 className="text-xl mb-4">{mode === 'edit' ? 'Edit Restaurant' : 'Create New Restaurant'}</h2>
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
              label="Address"
              error={errors.address}
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <CustomInput
              label="City"
              error={errors.city}
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <CustomInput
              label="Country"
              error={errors.country}
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
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
            <label className="block text-gray-700">Francesinhas</label>
            <Select
              isMulti
              options={francesinhas.map(f => ({ value: f.id, label: f.name }))}
              value={selectedFrancesinhas}
              onChange={setSelectedFrancesinhas}
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

export default RestaurantModal;
