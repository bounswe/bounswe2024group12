import React, { useState } from "react";
import FENRenderer from "../common/FENRenderer";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Button, Select, MenuItem, Box, Stack, Typography } from "@mui/material";

const GameScreen = ({ moves }) => {
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);

  const goToMove = (index) => {
    if (index >= 0 && index < moves.length) {
      setCurrentMoveIndex(index);
    }
  };

  const handlePrevMove = () => {
    goToMove(currentMoveIndex - 1);
  };

  const handleNextMove = () => {
    goToMove(currentMoveIndex + 1);
  };

  const handleMoveSelect = (e) => {
    const selectedMove = parseInt(e.target.value, 10);
    goToMove(selectedMove);
  };

  const currentPosition = moves[currentMoveIndex];

  return (
    <Box
      className="game-screen"
      sx={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        backgroundColor: "background.default",
        p: 3,
        borderRadius: 2,
      }}
    >
      <Box className="chessboard-container" sx={{ display: "flex", justifyContent: "center" }}>
        <FENRenderer fen={currentPosition} width={600} />
      </Box>

      <Stack
        className="controls"
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={2}
        sx={{ mt: 2 }}
      >
        <Button
          onClick={handlePrevMove}
          variant="contained"
          color="secondary"
          startIcon={<FaArrowLeft />}
          disabled={currentMoveIndex === 0}
        >
          Previous
        </Button>

        <Select
          value={currentMoveIndex}
          onChange={handleMoveSelect}
          variant="outlined"
          sx={{
            minWidth: 120,
            bgcolor: "background.paper",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "secondary.main",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "primary.main",
            },
          }}
        >
          {moves.map((_, index) => (
            <MenuItem key={index} value={index}>
              Move {index + 1}
            </MenuItem>
          ))}
        </Select>

        <Button
          onClick={handleNextMove}
          variant="contained"
          color="primary"
          endIcon={<FaArrowRight />}
          disabled={currentMoveIndex === moves.length - 1}
        >
          Next
        </Button>
      </Stack>
    </Box>
  );
};

export default GameScreen;
