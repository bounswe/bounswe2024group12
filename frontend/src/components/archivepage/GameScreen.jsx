import React, { useState, useEffect, useMemo } from "react";
import FENRenderer from "../common/FENRenderer";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { MdExpandLess, MdExpandMore } from "react-icons/md";
import { Button, Select, MenuItem, Box, Stack, Typography, List, ListItem, ListItemText, IconButton, Collapse } from "@mui/material";
import ShareComment from "./ShareComment";
import CommentsList from "./CommentsList";
import { Chess } from "chess.js";

const BACKEND_URL = process.env.REACT_APP_API_URL;

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

  // Memoize fenList to avoid unnecessary recalculations on re-renders
  const { fenList, metadata } = useMemo(() => pgnToFenListAndMetadata(game.pgn), [game.pgn]);

  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [commentsByStep, setCommentsByStep] = useState({}); // To store comments by step
  const [loadingComments, setLoadingComments] = useState(true); // To handle loading state
  const [movesListOpen, setMovesListOpen] = useState(false); // State to handle collapse

  const fetchComments = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/games/${game.id}/comments/`);
      if (!response.ok) throw new Error('Failed to fetch comments');
      const data = await response.json();

      const commentsByFen = data.comments.reduce((acc, comment) => {
        const fenIndex = fenList.indexOf(comment.position_fen);
        if (fenIndex !== -1) {
          if (!acc[fenIndex]) acc[fenIndex] = [];
          acc[fenIndex].push({
            id: comment.id,
            username: comment.user,
            text: comment.comment_text,
            fen: comment.comment_fens,
          });
        }
        return acc;
      }, {});

      setCommentsByStep(commentsByFen);
      setLoadingComments(false);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setLoadingComments(false);
    }
  };

  // Fetch comments for the game (only when game.id changes)
  useEffect(() => {
    if (game.id) {
      fetchComments();
    }
  }, [game.id]); // Only depend on game.id for fetching comments

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

  const handleAddComment = () => {
    fetchComments(); // Refetch comments after adding a new comment
  };

  const commentsForCurrentStep = commentsByStep[currentMoveIndex] || [];
  const currentPosition = fenList[currentMoveIndex];

  const toggleMovesList = () => {
    setMovesListOpen((prev) => !prev);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        backgroundColor: "background.default",
        p: 3,
        borderRadius: 2,
      }}
    >
      {/* Game Section */}
      <Box
        sx={{
          flex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
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

        {/* Moves List Section */}
        <Box sx={{ width: "100%", mt: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
              backgroundColor: "primary.light",
              px: 2,
              py: 1,
              borderRadius: 1,
              cursor: "pointer",
            }}
            onClick={toggleMovesList}
          >
            <Typography variant="subtitle1">All Moves</Typography>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                toggleMovesList();
              }}
              size="small"
            >
              {movesListOpen ? <MdExpandLess /> : <MdExpandMore />}
            </IconButton>
          </Box>
          <Collapse in={movesListOpen}>
            <List sx={{ maxHeight: 300, overflow: "auto", bgcolor: "background.paper" }}>
              {fenList.map((fen, index) => (
                <ListItem
                  button
                  key={index}
                  selected={currentMoveIndex === index}
                  onClick={() => goToMove(index)}
                  sx={{ cursor: "pointer" }}
                >
                  <ListItemText
                    primary={`Move ${index + 1}`}
                    secondary={`${fen.substring(0, 20)}...`}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {commentsByStep[index]?.length || 0} comments
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Collapse>
        </Box>
      </Box>

      {/* Comments Section */}
      <Box sx={{ flex: 1, ml: 3 }}>
        <ShareComment onCommentSubmit={handleAddComment} gameId={game.id} currentFEN={currentPosition} />
        {loadingComments ? (
          <Typography>Loading comments...</Typography>
        ) : (
          <CommentsList comments={commentsForCurrentStep} />
        )}
      </Box>
    </Box>
  );
};

export default GameScreen;
