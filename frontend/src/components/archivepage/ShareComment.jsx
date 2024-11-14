import React, { useState } from "react";
import { TextField, Button, Box, Input, Typography, Card, Snackbar, Alert } from "@mui/material";
import FENRenderer from "../common/FENRenderer";

const ShareComment = ({ onCommentSubmit }) => {
  const [commentText, setCommentText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [imageName, setImageName] = useState(null);
  const [fen, setFen] = useState("");
  const [showChessboard, setShowChessboard] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleCommentSubmit = () => {
    if (commentText.trim()) {
      onCommentSubmit({ text: commentText, image: imagePreview, fen });
      setSnackbarMessage("Comment shared successfully!");
      setCommentText("");
      setImagePreview(null);
      setImageName(null);
      setFen("");
      setShowChessboard(false);
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
    <Card sx={{ padding: 2, marginTop: 2}}>
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
    <Box sx={{ display: "flex", flexDirection: "row", alignItems:"center", gap: 5}}>
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
      <Box sx={{ display: "flex", justifyContent: "center", gap: 5}}>
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
    <Box sx={{ display: "flex", justifyContent: "flex-end", pr:0, mb:2}}>
      <Button variant="contained" color="primary" onClick={handleCommentSubmit} sx={{ marginTop: 2}}>
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
