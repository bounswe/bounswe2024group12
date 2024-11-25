import React from 'react';

const Chessboard = ({ position, width }) => {
  return (
    <div 
      data-testid="mock-chessboard"
      style={{ width: width || '400px', height: width || '400px' }}
    >
      <div>Chess Position: {position}</div>
    </div>
  );
};

export default Chessboard;