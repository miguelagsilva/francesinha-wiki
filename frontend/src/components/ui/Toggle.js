import React from 'react';

const Pagination = ({ onToggle, text, className = "" }) => {
  return (
    <label class={`inline-flex items-center me-5 cursor-pointer ${className}`}>
      <input type="checkbox" value="" class="sr-only peer focus:outline-none" onChange={onToggle}/>
      <div class="relative w-11 h-6 bg-gray-200 rounded-full dark:peer-focus:ring-red-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-600"></div>
      <span class="ms-3 text-sm font-medium text-gray-400 shadow-sm">{text}</span>
    </label>
  );
};

export default Pagination;
