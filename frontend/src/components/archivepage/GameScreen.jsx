import React, { useState, useEffect, useMemo } from "react";
import FENRenderer from "../common/FENRenderer";
import { FaArrowLeft, FaArrowRight, FaPencilAlt } from "react-icons/fa";
import { MdExpandLess, MdExpandMore } from "react-icons/md";
import { Button, Select, MenuItem, Box, Stack, Typography, List, ListItem, ListItemText, IconButton, Collapse, Tooltip } from "@mui/material";
import ShareComment from "./ShareComment";
import CommentsList from "./CommentsList";
import AnnotationTooltip from "./AnnotationTooltip";
import AddAnnotationDialog from "./AddAnnotationDialog";
import { Chess } from "chess.js";
import { BsDatabase } from 'react-icons/bs';
import MasterGamesDialog from './MasterGamesDialog';

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

const GameScreen = ({ game, currentUser, onGameSelect, onMetadataClick }) => {
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page
  }, []);

  // Memoize fenList to avoid unnecessary recalculations on re-renders
  const { fenList, metadata } = useMemo(() => pgnToFenListAndMetadata(game.pgn), [game.pgn]);

  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [commentsByStep, setCommentsByStep] = useState({}); // To store comments by step
  const [annotationsByStep, setAnnotationsByStep] = useState({}); // To store annotations by step
  const [loadingComments, setLoadingComments] = useState(true); // To handle loading state
  const [loadingAnnotations, setLoadingAnnotations] = useState(true); // To handle loading annotations
  const [movesListOpen, setMovesListOpen] = useState(false); // State to handle collapse
  const [isAddAnnotationOpen, setIsAddAnnotationOpen] = useState(false); // State for Add Annotation Dialog
  const [selectedStepForAnnotation, setSelectedStepForAnnotation] = useState(null); // Step selected for adding annotation
  const [editingAnnotation, setEditingAnnotation] = useState(null);
  const [masterGamesOpen, setMasterGamesOpen] = useState(false);
  const [masterGames, setMasterGames] = useState([]);
  const [loadingMasterGames, setLoadingMasterGames] = useState(false);
  const [targetFen, setTargetFen] = useState(null);

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

  const fetchAnnotations = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/games/${game.id}/annotations/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        }
      });
      if (!response.ok) throw new Error('Failed to fetch annotations');
      const data = await response.json();
      
      // Add data validation
      if (!data || !Array.isArray(data.annotations)) {
        console.warn('Invalid annotations data received:', data);
        setAnnotationsByStep({});
        setLoadingAnnotations(false);
        return;
      }
    
      // Convert W3C Annotations to our internal format
      const annotationsByFen = data.annotations.reduce((acc, annotation) => {
        // Add null checks for nested properties
        if (!annotation?.target?.state?.fen) {
          console.warn('Invalid annotation format:', annotation);
          return acc;
        }

        const fenIndex = fenList.indexOf(annotation.target.state.fen);
        if (fenIndex !== -1) {
          if (!acc[fenIndex]) acc[fenIndex] = [];
          acc[fenIndex].push({
            id: annotation.id,
            text: annotation.body?.value || '',
            username: annotation.creator?.name || 'Unknown',
            created: annotation.created,
            modified: annotation.modified
          });
        }
        return acc;
      }, {});
    
      setAnnotationsByStep(annotationsByFen);
      setLoadingAnnotations(false);
    } catch (error) {
      console.error('Error fetching annotations:', error);
      setAnnotationsByStep({}); // Set empty object on error
      setLoadingAnnotations(false);
    }
  };

  // Fetch comments and annotations for the game (only when game.id changes)
  useEffect(() => {
    if (game.id) {
      fetchComments();
      fetchAnnotations();
    }
  }, [game.id]); // Only depend on game.id for fetching comments and annotations

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

  const handleAddAnnotation = () => {
    // Open the Add Annotation Dialog
    setIsAddAnnotationOpen(true);
  };

  const handleCloseAddAnnotation = () => {
    setIsAddAnnotationOpen(false);
    setSelectedStepForAnnotation(null);
    setEditingAnnotation(null);
  };

  const handleEditAnnotation = async (stepIndex, text, annotationId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/games/${game.id}/annotations/${annotationId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          "@context": "http://www.w3.org/ns/anno.jsonld",
          type: "Annotation",
          body: {
            type: "TextualBody",
            value: text,
            format: "text/plain"
          },
          target: {
            type: "ChessPosition",
            source: `${window.location.origin}/games/${game.id}`,
            state: {
              fen: fenList[stepIndex],
              moveNumber: stepIndex + 1
            }
          }
        }),
      });
      
      if (!response.ok) throw new Error('Failed to update annotation');
      const updatedAnnotation = await response.json();

      setAnnotationsByStep((prev) => {
        const updated = { ...prev };
        updated[stepIndex] = updated[stepIndex].map(a => 
          a.id === annotationId ? {
            ...a,
            text: updatedAnnotation.body.value,
            modified: updatedAnnotation.modified
          } : a
        );
        return updated;
      });
      await fetchAnnotations();
    } catch (error) {
      console.error('Error updating annotation:', error);
      await fetchAnnotations();
    }
  };

  const handleSubmitAnnotation = async (stepIndex, text, annotationId = null) => {
    if (annotationId) {
      return handleEditAnnotation(stepIndex, text, annotationId);
    }
    
    try {
      const response = await fetch(`${BACKEND_URL}/games/${game.id}/annotations/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          "@context": "http://www.w3.org/ns/anno.jsonld",
          type: "Annotation",
          creator: {
            id: currentUser,
            name: currentUser,
            type: "Person"
          },
          body: {
            type: "TextualBody",
            value: text,
            format: "text/plain"
          },
          target: {
            type: "ChessPosition",
            source: `${window.location.origin}/games/${game.id}`,
            state: {
              fen: fenList[stepIndex],
              moveNumber: stepIndex + 1
            }
          },
          motivation: "commenting"
        }),
      });
      
      if (!response.ok) throw new Error('Failed to add annotation');
      const newAnnotation = await response.json();
      console.log('New Annotation:', newAnnotation);
      // Update local state with the new annotation
      setAnnotationsByStep((prev) => {
        const updated = { ...prev };
        if (!updated[stepIndex]) updated[stepIndex] = [];
        updated[stepIndex].push({
          id: newAnnotation.id,
          text: newAnnotation.body.value,
          username: newAnnotation.creator.name,
          created: newAnnotation.created,
          modified: newAnnotation.modified
        });
        return updated;
      });
    } catch (error) {
      console.error('Error adding annotation:', error);
      await fetchAnnotations();
    }
  };

  const handleDeleteAnnotation = async (stepIndex, annotationId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/games/${game.id}/annotations/${annotationId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to delete annotation');

      setAnnotationsByStep((prev) => {
        const updated = { ...prev };
        updated[stepIndex] = updated[stepIndex].filter(a => a.id !== annotationId);
        return updated;
      });
    } catch (error) {
      console.error('Error deleting annotation:', error);
      await fetchAnnotations();
    }
  };

  const commentsForCurrentStep = commentsByStep[currentMoveIndex] || [];
  const annotationsForCurrentStep = annotationsByStep[currentMoveIndex] || [];
  const currentPosition = fenList[currentMoveIndex];

  const toggleMovesList = () => {
    setMovesListOpen((prev) => !prev);
  };

  const fetchMasterGames = async (fen) => {
    setLoadingMasterGames(true);
    try {
      const encodedFen = encodeURIComponent(fen.replace(/\s+/g, '_'));
      console.log('Fetching games for FEN:', fen);
      
      const response = await fetch(`${BACKEND_URL}/games/explore/?fen=${encodedFen}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await response.json();
      console.log('API Response:', data);
      
      if (!response.ok) throw new Error('Failed to fetch master games');
      
      // Pass the entire response data
      setMasterGames(data);
    } catch (error) {
      console.error('Error fetching master games:', error);
      setMasterGames(null);
    } finally {
      setLoadingMasterGames(false);
    }
  };

  const handleMoreGamesClick = () => {
    setTargetFen(currentPosition);
    setMasterGamesOpen(true);
    fetchMasterGames(currentPosition);
  };

  const handleMasterGameSelect = async (gameId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/games/master_game/${gameId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch master game');
      const data = await response.json();

      // Create a game object in the format your app expects
      const selectedGame = {
        id: data.game.id,
        pgn: data.game.pgn,
        white: data.game.white,
        black: data.game.black,
        result: data.game.result,
        year: data.game.year,
        event: data.game.event,
        site: data.game.site,
        date: `${data.game.year}.${String(data.game.month).padStart(2, '0')}.${String(data.game.day).padStart(2, '0')}`
      };
      
      // Update the current game first
      setMasterGamesOpen(false); // Close the dialog
      if (onGameSelect) {
        onGameSelect(selectedGame);
      }

      // Parse the new game's PGN to get FEN list
      const { fenList: newFenList, metadata: newMetadata } = pgnToFenListAndMetadata(data.game.pgn);
      
      // Find the move index that matches our saved target FEN
      const matchingMoveIndex = newFenList.findIndex(fen => fen === targetFen);
      console.log('Target FEN:', targetFen);
      console.log('Matching index:', matchingMoveIndex);
      console.log('Available FENs:', newFenList);
      
      // Set the move index to the matching position, or 0 if not found
      setCurrentMoveIndex(matchingMoveIndex !== -1 ? matchingMoveIndex : 0);
      
      // Clear existing comments and annotations
      setCommentsByStep({});
      setAnnotationsByStep({});
      
      // Fetch new comments and annotations if needed
      fetchComments();
      fetchAnnotations();
    } catch (error) {
      console.error('Error fetching master game:', error);
    }
  };


  const handleMetadataClick = (filterType, value) => {
    if (onMetadataClick) {
      onMetadataClick(filterType, value);
    }
  };

  // Find the container/content area and add/update the styles
  const contentStyle = {
    // existing styles...
    fontSize: '1.1rem',  // Increase base font size
    // ...
  }

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
          <Typography 
            variant="h5" 
            onClick={() => handleMetadataClick('event', metadata.Event)}
            sx={{ 
              cursor: 'pointer',
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            {metadata.Event || "Unknown Event"}
          </Typography>
          <Typography variant="subtitle1">
            <span 
              onClick={() => handleMetadataClick('player', metadata.White)}
              style={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
            >
              {metadata.White || "White"}
            </span>
            {" vs "}
            <span 
              onClick={() => handleMetadataClick('player', metadata.Black)}
              style={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
            >
              {metadata.Black || "Black"}
            </span>
          </Typography>
          <Typography 
            variant="subtitle2"
            onClick={() => handleMetadataClick('year', metadata.Date?.split('.')[0])}
            sx={{ 
              cursor: 'pointer',
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            {metadata.Date || "Unknown Date"}
          </Typography>
          <Typography 
            variant="body2"
            onClick={() => handleMetadataClick('result', metadata.Result)}
            sx={{ 
              cursor: 'pointer',
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            Result: {metadata.Result || "N/A"}
          </Typography>
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
            data-testid="previous-button"
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
            data-testid="next-button"
          >
            Next
          </Button>

          <Button
            onClick={handleMoreGamesClick}
            variant="outlined"
            startIcon={<BsDatabase />}
          >
            More Games
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
              backgroundColor: "primary.light", // Use theme color
              px: 2,
              py: 1,
              borderRadius: 1,
              cursor: "pointer",
            }}
            onClick={toggleMovesList} // Made the entire header clickable
          >
            <Typography variant="subtitle1">All Moves</Typography>
            <IconButton
              onClick={(e) => {
                e.stopPropagation(); // Prevents the parent onClick from triggering
                toggleMovesList(); // Toggles the moves list
              }}
              size="small"
            >
              {movesListOpen ? <MdExpandLess /> : <MdExpandMore />}
            </IconButton>
          </Box>
          <Collapse in={movesListOpen}>
            <List sx={{ maxHeight: 300, overflow: "auto", bgcolor: "background.paper" }}>
              {fenList.map((fen, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                  <Tooltip
                    title={
                      annotationsByStep[index]?.length > 0 ? (
                        <AnnotationTooltip
                          annotations={annotationsByStep[index]}
                          onDelete={(annotationId) => handleDeleteAnnotation(index, annotationId)}
                          onEdit={(annotation) => {
                            if (annotation.username !== currentUser) {
                              return;
                            }
                            setSelectedStepForAnnotation(index);
                            setEditingAnnotation(annotation);
                            setIsAddAnnotationOpen(true);
                          }}
                          currentUser={currentUser}
                        />
                      ) : (
                        "No Annotations"
                      )
                    }
                    arrow
                    placement="right"
                  >
                    <ListItem
                      button
                      selected={currentMoveIndex === index}
                      onClick={() => goToMove(index)}
                      sx={{
                        cursor: "pointer",
                        backgroundColor: annotationsByStep[index] ? "background.annotation" : "inherit", // Highlight if annotated
                      }}
                    >
                      <ListItemText
                        primary={`Move ${index + 1}`}
                        secondary={`${fen}`}
                      />
                      {commentsByStep[index]?.length > 0 && (
                        <Typography variant="caption" color="text.secondary">
                          {commentsByStep[index].length} comments
                        </Typography>
                      )}
                    </ListItem>
                  </Tooltip>
                  <IconButton
                    onClick={() => {
                      setSelectedStepForAnnotation(index);
                      setIsAddAnnotationOpen(true);
                    }}
                    size="small"
                    sx={{ ml: 1 }}
                  >
                    <FaPencilAlt />
                  </IconButton>
                </Box>
              ))}
            </List>
          </Collapse>
        </Box>

        {/* Add Annotation Dialog */}
        {isAddAnnotationOpen && (
          <AddAnnotationDialog
            open={isAddAnnotationOpen}
            onClose={handleCloseAddAnnotation}
            onSubmit={handleSubmitAnnotation}
            stepIndex={selectedStepForAnnotation}
            editAnnotation={editingAnnotation}
          />
        )}
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

      <MasterGamesDialog
        open={masterGamesOpen}
        onClose={() => setMasterGamesOpen(false)}
        games={masterGames}
        loading={loadingMasterGames}
        onGameSelect={handleMasterGameSelect}
      />
    </Box>
  );
};

export default GameScreen;
