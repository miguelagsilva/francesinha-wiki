import React from 'react';

const CustomInput = ({ error, label, ...props }) => {
  return (
    <div>
      {label && <label className="block text-gray-700">{label}</label>}
      <input
        className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 shadow-sm "
        {...props}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default CustomInput;

