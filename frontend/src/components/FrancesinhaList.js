import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FrancesinhaModal from './modals/FrancesinhaModal';
import CustomButton from './ui/Button';
import CustomInput from './ui/Input';
import CustomToggle from './ui/Toggle';
import Pagination from './ui/Pagination';

const FrancesinhaList = () => {
  const [francesinhas, setFrancesinhas] = useState([]);
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const [selectedFrancesinha, setSelectedFrancesinha] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [showDeleted, setShowDeleted] = useState(false);

  useEffect(() => {
    fetchFrancesinhas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, sortBy, order, currentPage, showDeleted]);

  const fetchFrancesinhas = async () => {
    try {
      const response = await axios.get('/francesinhas', {
        params: { q: query, sortBy, order, limit: 10, page: currentPage, includeDeleted: showDeleted }
      });
      setFrancesinhas(response.data.rows);
      setMaxPage(response.data.maxPage);
      if (currentPage > response.data.maxPage) {
        setCurrentPage(response.data.maxPage);
      }
    } catch (error) {
      console.error('Error fetching francesinhas:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/francesinhas/${id}`);
      fetchFrancesinhas();
    } catch (error) {
      console.error('Error deleting francesinha:', error);
    }
  };

  const handleRestore = async (id) => {
    try {
      await axios.put(`/francesinhas/recover/${id}`);
      fetchFrancesinhas();
    } catch (error) {
      console.error('Error recovering francesinha:', error);
    }
  };

  const handleSort = (field) => {
    const isAsc = sortBy === field && order === 'asc';
    setSortBy(field);
    setOrder(isAsc ? 'desc' : 'asc');
  };

  const handleEdit = async (updatedFrancesinha) => {
    try {
      await axios.put(`/francesinhas/${updatedFrancesinha.id}`, updatedFrancesinha);
      fetchFrancesinhas();
    } catch (error) {
      console.error('Error updating francesinha:', error);
    }
  };

  const handleCreate = async (newFrancesinha) => {
    try {
      await axios.post('/francesinhas', newFrancesinha);
      fetchFrancesinhas();
    } catch (error) {
      console.error('Error creating francesinha:', error);
    }
  };

  const handleRestaurantClick = (restaurant) => {
    //setSelectedFrancesinha(francesinha);
  };

  const handleIngredientClick = (ingredient) => {
  };

  const handlePhotoClick = (photo) => {
  };

  const handlePaginationChange = (page) => { 
    setCurrentPage(page);
  };

  const handleShowDeletedToggle = () => { 
    setShowDeleted(!showDeleted);
    setCurrentPage(1);
  }

  return (
    <div className="min-h-full p-1">
      <div className="border-solid border-2 border-b border-gray-200 flex flex-col w-full max-w-7xl mx-auto">
        <div className="overflow-x-auto relative shadow-md sm:rounded-lg w-full">
          <div className="overflow-x-auto relative shadow-md sm:rounded-lg w-full bg-white p-4">
            <div className="mb-4 flex flex-col sm:flex-row items-center justify-between">
              <div className="w-full sm:w-1/3 mb-4 sm:mb-0">
                <CustomInput
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search francesinhas..."
                />
              </div>
              <div className="flex items-center w-full sm:w-auto ml-auto mb-4 sm:mb-0">
                <CustomToggle
                  text="Show deleted"
                  onToggle={() => handleShowDeletedToggle()}
                />
              </div>
              <CustomButton
                onClick={() => {
                  setIsModalOpen(true);
                  setModalMode('create');
                  setSelectedFrancesinha(null);
                }}
                className="bg-green-500 hover:bg-green-700 w-full sm:w-auto"
                text="Create new francesinha"
              />
            </div>
            <div className="block w-full sm:hidden mb-4">
              <select
                className="border p-2 w-full"
                value={sortBy}
                onChange={(e) => handleSort(e.target.value)}
              >
                <option value="name">Name</option>
                <option value="price">Price</option>
                <option value="rating">Rating</option>
              </select>
              <select
                className="border p-2 w-full mt-2"
                value={order}
                onChange={(e) => setOrder(e.target.value)}
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
            <div className="block w-full sm:hidden">
              {francesinhas.map((francesinha) => (
                <div key={francesinha.id} className="bg-white border-b hover:bg-gray-100 p-4 mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="font-bold">Photos:</span>
                    {JSON.parse(francesinha.photos)[0] != null &&
                      <button onClick={() => handlePhotoClick(JSON.parse(francesinha.photos)[0])} className="text-blue-500">
                        <img 
                          src={JSON.parse(francesinha.photos)[0].url}
                          alt={francesinha.name}
                        />
                      </button>
                    }
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="font-bold">Name:</span> {francesinha.name}
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="font-bold">Price:</span> {francesinha.price}
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="font-bold">Rating:</span> {francesinha.rating}
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="font-bold">Ingredients:</span>
                    <div>
                      {francesinha.Ingredients?.map((ingredient) => (
                        <button key={ingredient.id} onClick={() => handleIngredientClick(ingredient)} className="text-blue-500">
                          {ingredient.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="font-bold">Restaurants:</span>
                    <div>
                      {francesinha.Restaurants?.map((restaurant) => (
                        <button key={restaurant.id} onClick={() => handleRestaurantClick(restaurant)} className="text-blue-500">
                          {restaurant.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <CustomButton
                      onClick={() => {
                        setIsModalOpen(true);
                        setModalMode('edit');
                        console.log(francesinha);
                        setSelectedFrancesinha(francesinha);
                      }}
                      className="bg-blue-500 hover:bg-blue-700 mr-2"
                      text="Edit"
                    />
                    <CustomButton
                      onClick={() => handleDelete(francesinha.id)}
                      className="bg-red-500 hover:bg-red-700"
                      text="Delete"
                    />
                  </div>
                </div>
              ))}
            </div>
            <table className="hidden sm:table w-full text-sm text-left text-gray-500 table-fixed">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="py-3 px-2 sm:px-6">Photos</th>
                  <th
                    scope="col"
                    className={`py-3 px-2 sm:px-6 cursor-pointer ${sortBy === 'name' ? 'bg-gray-200' : ''}`}
                    onClick={() => handleSort('name')}
                  >
                    Name {sortBy === 'name' && (order === 'asc' ? '▲' : '▼')}
                  </th>
                  <th
                    scope="col"
                    className={`py-3 px-2 sm:px-6 cursor-pointer ${sortBy === 'price' ? 'bg-gray-200' : ''}`}
                    onClick={() => handleSort('price')}
                  >
                    Price {sortBy === 'price' && (order === 'asc' ? '▲' : '▼')}
                  </th>
                  <th
                    scope="col"
                    className={`py-3 px-2 sm:px-6 cursor-pointer ${sortBy === 'rating' ? 'bg-gray-200' : ''}`}
                    onClick={() => handleSort('rating')}
                  >
                    Rating {sortBy === 'rating' && (order === 'asc' ? '▲' : '▼')}
                  </th>
                  <th scope="col" className="py-3 px-2 sm:px-6">Ingredients</th>
                  <th scope="col" className="py-3 px-2 sm:px-6">Restaurants</th>
                  <th scope="col" className="py-3 px-2 sm:px-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {francesinhas.map((francesinha) => (
                  <tr key={francesinha.id} className="bg-white border-b hover:bg-gray-100">
                    <td className="py-2 px-1 sm:px-2">
                      {JSON.parse(francesinha.photos)[0] != null &&
                        <button onClick={() => handlePhotoClick(JSON.parse(francesinha.photos)[0])} className="text-blue-500">
                          <img 
                            src={JSON.parse(francesinha.photos)[0].url}
                            alt={francesinha.name}
                          />
                        </button>
                      }
                    </td>
                    <td className="py-4 px-2 sm:px-6">{francesinha.name}</td>
                    <td className="py-4 px-2 sm:px-6">{francesinha.price}€</td>
                    <td className="py-4 px-2 sm:px-6">{francesinha.rating}</td>
                    <td className="py-4 px-2 sm:px-6">
                      {francesinha.Ingredients?.map((ingredient) => (
                        <div key={ingredient.id}>
                          <button onClick={() => handleRestaurantClick(ingredient)} className="text-blue-500">
                            {ingredient.name}
                          </button>
                        </div>
                      ))}
                    </td>
                    <td className="py-4 px-2 sm:px-6">
                      {francesinha.Restaurants?.map((restaurant) => (
                        <div key={restaurant.id}>
                          <button onClick={() => handleRestaurantClick(restaurant)} className="text-blue-500">
                            {restaurant.name}
                          </button>
                        </div>
                      ))}
                    </td>
                    <td className="py-4 px-4 flex flex-col space-y-2">
                      <CustomButton
                        onClick={() => {
                          setIsModalOpen(true);
                          setModalMode('edit');
                          setSelectedFrancesinha(francesinha)
                        }}
                        className="bg-blue-500 hover:bg-blue-700 w-full"
                        text="Edit"
                      />
                      {showDeleted && <CustomButton
                        onClick={() => handleRestore(francesinha.id)}
                        className="bg-green-500 hover:bg-green-700 w-full"
                        text="Restore"
                      />}
                      {!showDeleted && <CustomButton
                        onClick={() => handleDelete(francesinha.id)}
                        className="bg-red-500 hover:bg-red-700 w-full"
                        text="Delete"
                      />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <FrancesinhaModal
        francesinha={selectedFrancesinha}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDone={modalMode === 'edit' ? handleEdit : handleCreate}
        mode={modalMode}
      />
      <Pagination 
        className="mt-4"
        currentPage={currentPage}
        maxPage={maxPage}
        onChange={(page) => handlePaginationChange(page)}
      />
    </div>
  );
};

export default FrancesinhaList;
