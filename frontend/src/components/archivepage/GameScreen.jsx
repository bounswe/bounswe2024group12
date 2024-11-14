import React, { useState } from "react";
import FENRenderer from "../common/FENRenderer";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Button, Select, MenuItem, Box, Stack, Typography } from "@mui/material";
import ShareComment from "./ShareComment";
import CommentsList from "./CommentsList";

const GameScreen = ({ moves }) => {
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);

  const initialCommentsByStep = {
    0: [
      {
        id: 1,
        username: "Alice",
        text: "Great opening move!",
        fen: "start",
        image: null,
        userIcon: null,
      },
      {
        id: 2,
        username: "Bob",
        text: "Looking forward to seeing how this goes.",
        fen: null,
        image: null,
        userIcon: null,
      },
    ],
    1: [
      {
        id: 1,
        username: "Charlie",
        text: "Classic e4 opening!",
        fen: "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
        image: null,
        userIcon: null,
      },
      {
        id: 2,
        username: "Dana",
        text: "I prefer d4 myself.",
        fen: null,
        image: null,
        userIcon: null,
      },
    ],
    2: [
      {
        id: 1,
        username: "Eve",
        text: "Both players are playing really solidly.",
        fen: "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        image: null,
        userIcon: null,
      },
    ],
    3: [
      {
        id: 1,
        username: "Frank",
        text: "Knight to f3, a classic move!",
        fen: "rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2",
        image: null,
        userIcon: null,
      },
    ],
  };

  const [commentsByStep, setCommentsByStep] = useState(initialCommentsByStep);


  const goToMove = (index) => {
    if (index >= 0 && index < moves.length) {
      setCurrentMoveIndex(index);
    }
  };

  const handlePrevMove = () => goToMove(currentMoveIndex - 1);
  const handleNextMove = () => goToMove(currentMoveIndex + 1);

  const handleMoveSelect = (e) => {
    const selectedMove = parseInt(e.target.value, 10);
    goToMove(selectedMove);
  };

  const handleAddComment = (comment) => {
    setCommentsByStep((prev) => ({
      ...prev,
      [currentMoveIndex]: [
        ...(prev[currentMoveIndex] || []),
        { ...comment, id: (prev[currentMoveIndex]?.length || 0) + 1 },
      ],
    }));
  };

  const commentsForCurrentStep = commentsByStep[currentMoveIndex] || [];
  const currentPosition = moves[currentMoveIndex];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "background.default",
        p: 3,
        borderRadius: 2,
      }}
    >

      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <FENRenderer fen={currentPosition} width={600} />
      </Box>

      <Stack
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

      <Box sx={{ width: "50%", mt: 3 }}>
        <ShareComment onCommentSubmit={handleAddComment} />
        <CommentsList comments={commentsForCurrentStep} />
      </Box>
    </Box>
  );
};

export default GameScreen;
