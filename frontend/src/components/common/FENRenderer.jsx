
import React from "react";
import Chessboard from "chessboardjsx";

const FENRenderer = ({ fen, width }) => {
  return (
    <Chessboard
      position={fen}
      width={width}
      draggable={false}
    />
  );
};

export default FENRenderer;
