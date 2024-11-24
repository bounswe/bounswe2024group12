import React, { useState } from "react";
import { TextField, Button, Box, Input, Typography, Card, Snackbar, Alert } from "@mui/material";
import FENRenderer from "../common/FENRenderer";

const BACKEND_URL = process.env.REACT_APP_API_URL;

const ShareComment = ({ onCommentSubmit, gameId, currentFEN }) => { // gameId as a prop
  const [commentText, setCommentText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [imageName, setImageName] = useState(null);
  const [fen, setFen] = useState("");
  const [showChessboard, setShowChessboard] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleCommentSubmit = async () => {
    if (commentText.trim()) {
      const commentData = {
        position_fen: currentFEN,  // FEN from the user input
        comment_fens: fen, // FEN or empty string
        comment_text: commentText,
      };
      console.log("Comment data:", commentData);
      // Call the API to submit the comment
      try {
        const response = await fetch(`${BACKEND_URL}/games/${gameId}/add_comment/`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(commentData),
        });

        if (response.ok) {
          const result = await response.json();
          setSnackbarMessage("Comment shared successfully!");
          // Optionally handle response data like showing the added comment, etc.
          onCommentSubmit(commentData); // Call the onCommentSubmit prop to handle additional logic
          setCommentText("");
          setImagePreview(null);
          setImageName(null);
          setFen("");
          setShowChessboard(false);
        } else {
          const error = await response.json();
          setSnackbarMessage(error.message || "Error adding comment.");
        }
      } catch (error) {
        setSnackbarMessage("Error adding comment.");
      }
    } else {
      setSnackbarMessage("Please enter a comment.");
    }
    setOpenSnackbar(true);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setImageName(file.name);
    }
  };

  const handleSaveFEN = () => {
    setShowChessboard(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Card sx={{ padding: 2, marginTop: 2 }}>
      <TextField
        fullWidth
        multiline
        rows={3}
        variant="outlined"
        label="Write a comment..."
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        sx={{ marginBottom: 1 }}
      />
      <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 5 }}>
        <Box sx={{ flex: 1, display: 'flex', gap: 2, marginBottom: 2 }}>
          <TextField
            fullWidth
            label="FEN"
            variant="outlined"
            value={fen}
            onChange={(e) => setFen(e.target.value)}
          />
          <Button variant="contained" onClick={handleSaveFEN}>Save FEN</Button>
        </Box>
        <Box sx={{ flex: 1, display: 'flex', gap: 2, marginBottom: 2, justifyContent: "space-around" }}>
          <Button variant="contained" component="label">
            Upload Image
            <Input type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
          </Button>
          {imageName && <Typography sx={{ ml: 1, mt: 1 }}>{imageName}</Typography>}
          {!imageName && <Typography sx={{ ml: 1, mt: 1 }}>No file chosen.</Typography>}
        </Box>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", gap: 5 }}>
        {(showChessboard && fen) && (
          <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
            <FENRenderer fen={fen} width={200} />
          </Box>
        )}

        {imagePreview && (
          <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
            <img src={imagePreview} alt="Preview" style={{ maxWidth: "100%", maxHeight: "200px" }} />
          </Box>
        )}
      </Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", pr: 0, mb: 2 }}>
        <Button variant="contained" color="primary" onClick={handleCommentSubmit} sx={{ marginTop: 2 }}>
          Share Comment
        </Button>
      </Box>

      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default ShareComment;
