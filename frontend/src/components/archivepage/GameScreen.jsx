import React, { useState, useEffect } from "react";
import FENRenderer from "../common/FENRenderer";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Button, Select, MenuItem, Box, Stack, Typography } from "@mui/material";
import ShareComment from "./ShareComment";
import CommentsList from "./CommentsList";
import { Chess } from "chess.js";

function pgnToFenListAndMetadata(pgn) {
  const chess = new Chess();
  const fenList = [chess.fen()]; // Start with the initial position
  const metadata = {};

  try {
    // Extract metadata headers (lines enclosed in square brackets)
    pgn.split("\n").forEach((line) => {
      if (line.startsWith("[")) {
        const match = line.match(/\[(\w+)\s+"([^"]+)"\]/);
        if (match) {
          metadata[match[1]] = match[2];
        }
      }
    });

    // Remove metadata headers to get the moves
    const movesSection = pgn.split("\n").filter((line) => !line.startsWith("[")).join(" ");

    // Extract moves by removing move numbers and splitting by spaces
    const moves = movesSection
      .split(/\s*\d+\.\s*/) // Split at move numbers
      .flatMap((part) => part.trim().split(/\s+/)) // Split moves by spaces
      .filter((move) => move && move !== "1/2-1/2" && move !== "0-1" && move !== "1-0"); // Remove result notations

    moves.forEach((move) => {
      const success = chess.move(move); // Attempt to make each move
      if (!success) {
        throw new Error(`Invalid move: ${move}`);
      }
      fenList.push(chess.fen()); // Add the position after the move
    });
  } catch (error) {
    console.error("Error processing PGN:", error.message);
    return { fenList: [], metadata: {} };
  }

  return { fenList, metadata };
}

const GameScreen = ({ game }) => {
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page
  }, []);
  const { fenList, metadata } = pgnToFenListAndMetadata(game.pgn);
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
  };

  const [commentsByStep, setCommentsByStep] = useState(initialCommentsByStep);

  const goToMove = (index) => {
    if (index >= 0 && index < fenList.length) {
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
  const currentPosition = fenList[currentMoveIndex];

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
      {/* Game Details Section */}
      <Box sx={{ textAlign: "center", mb: 3 }}>
        <Typography variant="h5">{metadata.Event || "Unknown Event"}</Typography>
        <Typography variant="subtitle1">
          {metadata.White || "White"} vs {metadata.Black || "Black"}
        </Typography>
        <Typography variant="subtitle2">{metadata.Date || "Unknown Date"}</Typography>
        <Typography variant="body2">Result: {metadata.Result || "N/A"}</Typography>
      </Box>

      {/* FEN Renderer */}
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <FENRenderer fen={currentPosition} width={520} />
      </Box>

      {/* Navigation Controls */}
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
          {fenList.map((_, index) => (
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
          disabled={currentMoveIndex === fenList.length - 1}
        >
          Next
        </Button>
      </Stack>

      {/* Comments Section */}
      <Box sx={{ width: "50%", mt: 3 }}>
        <ShareComment onCommentSubmit={handleAddComment} />
        <CommentsList comments={commentsForCurrentStep} />
      </Box>
    </Box>
  );
};

export default GameScreen;
