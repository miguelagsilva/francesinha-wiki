import React from 'react';

const CustomButton = ({ text, onClick, type = "button", className = "", ...props }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`mt-3 w-full inline-flex justify-center rounded-md bg-blue-500 border border-gray-300 shadow-sm px-4 py-2 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm ${className}`}
      {...props}
    >
      {text}
    </button>
  );
};

export default CustomButton;
