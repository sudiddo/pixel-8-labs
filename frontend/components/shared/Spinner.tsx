import React from 'react';

function Spinner() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-200" />
    </div>
  );
}

export default Spinner;
