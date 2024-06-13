import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CustomButton from '../ui/Button';
import CustomInput from '../ui/Input';
import Select from 'react-select';

const IngredientModal = ({ ingredient, isOpen, onClose, onDone, mode }) => {
  const [name, setName] = useState('');
  const [francesinhas, setFrancesinhas] = useState([]);
  const [selectedFrancesinhas, setSelectedFrancesinhas] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && ingredient) {
        setName(ingredient.name);
        setSelectedFrancesinhas(ingredient.Francesinhas.map(r => ({ value: r.id, label: r.name })));
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
  }, [ingredient, isOpen, mode]);

  const setBlankValues = () => {
    setName('');
    setSelectedFrancesinhas([]);
    setErrors({});
  };

  const validate = () => {
    const newErrors = {};

    if (!name || name.length < 3 || name.length > 100) {
      newErrors.name = 'Invalid Name, use 3-100 characters';
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
      francesinhas: selectedFrancesinhas.map(f => f.value),
    };
    if (mode === 'edit') {
      francesinhaData.id = ingredient.id;
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

export default IngredientModal;
