import React from 'react';

const Card = ({ children }) => {
  return (
    <div className="border rounded-lg p-4 bg-white shadow dark:bg-gray-800 dark:text-white">
      {children}
    </div>
  );
};

export default Card;
