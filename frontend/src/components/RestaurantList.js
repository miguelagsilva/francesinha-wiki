import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RestaurantModal from './modals/RestaurantModal';
import CustomButton from './ui/Button';
import CustomInput from './ui/Input';
import CustomToggle from './ui/Toggle';
import Pagination from './ui/Pagination';

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [showDeleted, setShowDeleted] = useState(false);

  useEffect(() => {
    fetchRestaurants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, sortBy, order, currentPage, showDeleted]);

  const fetchRestaurants = async () => {
    try {
      const response = await axios.get('/restaurants', {
        params: { q: query, sortBy, order, limit: 10, page: currentPage, includeDeleted: showDeleted }
      });
      setRestaurants(response.data.rows);
      setMaxPage(response.data.maxPage);
      if (currentPage > response.data.maxPage) {
        setCurrentPage(response.data.maxPage);
      }
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/restaurants/${id}`);
      fetchRestaurants();
    } catch (error) {
      console.error('Error deleting restaurant:', error);
    }
  };

  const handleRestore = async (id) => {
    try {
      await axios.put(`/restaurants/recover/${id}`);
      fetchRestaurants();
    } catch (error) {
      console.error('Error recovering restaurant:', error);
    }
  };

  const handleSort = (field) => {
    const isAsc = sortBy === field && order === 'asc';
    setSortBy(field);
    setOrder(isAsc ? 'desc' : 'asc');
  };

  const handleEdit = async (updatedRestaurant) => {
    try {
      await axios.put(`/restaurants/${updatedRestaurant.id}`, updatedRestaurant);
      fetchRestaurants();
    } catch (error) {
      console.error('Error updating restaurant:', error);
    }
  };

  const handleCreate = async (newRestaurant) => {
    try {
      await axios.post('/restaurants', newRestaurant);
      fetchRestaurants();
    } catch (error) {
      console.error('Error creating restaurant:', error);
    }
  };

  const handleFrancesinhaClick = (francesinha) => {
    //setSelectedFrancesinha(francesinha);
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
                  placeholder="Search restaurants..."
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
                  setSelectedRestaurant(null);
                }}
                className="bg-green-500 hover:bg-green-700 w-full sm:w-auto"
                text="Create new restaurant"
              />
            </div>
            <div className="block w-full sm:hidden mb-4">
              <select
                className="border p-2 w-full"
                value={sortBy}
                onChange={(e) => handleSort(e.target.value)}
              >
                <option value="name">Name</option>
                <option value="address">Address</option>
                <option value="city">City</option>
                <option value="country">Country</option>
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
              {restaurants.map((restaurant) => (
                <div key={restaurant.id} className="bg-white border-b hover:bg-gray-100 p-4 mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="font-bold">Name:</span> {restaurant.name}
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="font-bold">Address:</span> {restaurant.address}
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="font-bold">City:</span> {restaurant.city}
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="font-bold">Country:</span> {restaurant.country}
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="font-bold">Rating:</span> {restaurant.rating}
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="font-bold">Francesinhas:</span>
                    <div>
                      {restaurant.Francesinhas?.map((francesinha) => (
                        <button key={francesinha.id} onClick={() => handleFrancesinhaClick(francesinha)} className="text-blue-500">
                          {francesinha.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <CustomButton
                      onClick={() => {
                        setIsModalOpen(true);
                        setModalMode('edit');
                        setSelectedRestaurant(restaurant);
                      }}
                      className="bg-blue-500 hover:bg-blue-700 mr-2"
                      text="Edit"
                    />
                    <CustomButton
                      onClick={() => handleDelete(restaurant.id)}
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
                  <th
                    scope="col"
                    className={`py-3 px-2 sm:px-6 cursor-pointer ${sortBy === 'name' ? 'bg-gray-200' : ''}`}
                    onClick={() => handleSort('name')}
                  >
                    Name {sortBy === 'name' && (order === 'asc' ? '▲' : '▼')}
                  </th>
                  <th
                    scope="col"
                    className={`py-3 px-2 sm:px-6 cursor-pointer ${sortBy === 'address' ? 'bg-gray-200' : ''}`}
                    onClick={() => handleSort('address')}
                  >
                    Address {sortBy === 'address' && (order === 'asc' ? '▲' : '▼')}
                  </th>
                  <th
                    scope="col"
                    className={`py-3 px-2 sm:px-6 cursor-pointer ${sortBy === 'city' ? 'bg-gray-200' : ''}`}
                    onClick={() => handleSort('city')}
                  >
                    City {sortBy === 'city' && (order === 'asc' ? '▲' : '▼')}
                  </th>
                  <th
                    scope="col"
                    className={`py-3 px-2 sm:px-6 cursor-pointer ${sortBy === 'country' ? 'bg-gray-200' : ''}`}
                    onClick={() => handleSort('country')}
                  >
                    Country {sortBy === 'country' && (order === 'asc' ? '▲' : '▼')}
                  </th>
                  <th
                    scope="col"
                    className={`py-3 px-2 sm:px-6 cursor-pointer ${sortBy === 'rating' ? 'bg-gray-200' : ''}`}
                    onClick={() => handleSort('rating')}
                  >
                    Rating {sortBy === 'rating' && (order === 'asc' ? '▲' : '▼')}
                  </th>
                  <th scope="col" className="py-3 px-2 sm:px-6">Francesinhas</th>
                  <th scope="col" className="py-3 px-2 sm:px-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {restaurants.map((restaurant) => (
                  <tr key={restaurant.id} className="bg-white border-b hover:bg-gray-100">
                    <td className="py-4 px-2 sm:px-6">{restaurant.name}</td>
                    <td className="py-4 px-2 sm:px-6">{restaurant.address}</td>
                    <td className="py-4 px-2 sm:px-6">{restaurant.city}</td>
                    <td className="py-4 px-2 sm:px-6">{restaurant.country}</td>
                    <td className="py-4 px-2 sm:px-6">{restaurant.rating}</td>
                    <td className="py-4 px-2 sm:px-6">
                      {restaurant.Francesinhas?.map((francesinha) => (
                        <div key={francesinha.id}>
                          <button onClick={() => handleFrancesinhaClick(francesinha)} className="text-blue-500">
                            {francesinha.name}
                          </button>
                        </div>
                      ))}
                    </td>
                    <td className="py-4 px-4 flex flex-col space-y-2">
                      <CustomButton
                        onClick={() => {
                          setIsModalOpen(true);
                          setModalMode('edit');
                          setSelectedRestaurant(restaurant);
                        }}
                        className="bg-blue-500 hover:bg-blue-700 w-full"
                        text="Edit"
                      />
                      {showDeleted && <CustomButton
                        onClick={() => handleRestore(restaurant.id)}
                        className="bg-green-500 hover:bg-green-700 w-full"
                        text="Restore"
                      />}
                      {!showDeleted && <CustomButton
                        onClick={() => handleDelete(restaurant.id)}
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
      <RestaurantModal
        restaurant={selectedRestaurant}
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

export default RestaurantList;
