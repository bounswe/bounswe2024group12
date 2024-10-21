
import React from "react";
import Chessboard from "chessboardjsx";

const FENRenderer = ({ fen }) => {
  return (
    <Chessboard
      position={fen}
      width={200}
    />
  );
};

export default FENRenderer;
