import React from 'react';

const Input = ({ label, ...props }) => (
  <div className="mb-4">
    {label && (
      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
    )}
    <input
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-700 dark:text-white"
      {...props}
    />
  </div>
);

export default Input;
