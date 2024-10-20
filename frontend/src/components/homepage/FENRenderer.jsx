import Chessboard from "chessboardjsx";

const FENRenderer = ({ fen }) => {
    return (
        <Chessboard position={fen} />
    )
}

export default FENRenderer;