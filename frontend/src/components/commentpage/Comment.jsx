import React, { useState } from "react";
import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Box,
  TextField,
  Button,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FENRenderer from "../common/FENRenderer";

const BACKEND_URL = process.env.REACT_APP_API_URL;

const Comment = ({ comment, postId, onDelete }) => {
  console.log("Received comment data:", comment);

  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState("");
  const [editedFens, setEditedFens] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const currentUsername = localStorage.getItem("username");

  const handleEditMode = () => {
    setEditedText(comment.text);
    const fensToEdit = comment.fens || comment.fen_notations;
    setEditedFens(fensToEdit ? fensToEdit.split(',').map(fen => fen.trim()) : []);
    setIsEditing(true);
  };

  const handleEdit = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${BACKEND_URL}/posts/comment/${postId}/${comment.id}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            text: editedText,
            fens: editedFens.join(','),
          }),
        }
      );

      if (response.ok) {
        setSnackbarMessage("Comment updated successfully!");
        setSnackbarSeverity("success");
        setIsEditing(false);
        setOpenSnackbar(true);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        throw new Error("Failed to update comment");
      }
    } catch (error) {
      console.error(error);
      setSnackbarMessage("Error updating comment. Please try again.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${BACKEND_URL}/posts/comment/${postId}/${comment.id}/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setSnackbarMessage("Comment deleted successfully!");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        onDelete(comment.id); // Notify parent about the deletion
      } else {
        throw new Error("Failed to delete comment");
      }
    } catch (error) {
      console.error(error);
      setSnackbarMessage("Error deleting comment. Please try again.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Card sx={{ marginBottom: "10px" }}>
      <CardContent sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
        <Avatar alt={comment.user} src={comment.userIcon || ""} />

        <Box sx={{ flex: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: "bold" }}>
            {comment.user}
          </Typography>
          <Typography variant="caption" sx={{ color: "gray" }}>
            {new Date(comment.created_at).toLocaleString()}
          </Typography>

          {isEditing ? (
            <Box>
              <TextField
                fullWidth
                multiline
                rows={2}
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                sx={{ marginBottom: "10px" }}
              />
              {editedFens.map((fen, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <TextField
                    fullWidth
                    label={`FEN Position ${index + 1}`}
                    value={fen}
                    onChange={(e) => {
                      const newFens = [...editedFens];
                      newFens[index] = e.target.value;
                      setEditedFens(newFens);
                    }}
                  />
                  <FENRenderer fen={fen} width="150" />
                </Box>
              ))}
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Button variant="contained" color="primary" onClick={handleEdit}>
                  Save
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          ) : (
            <Box>
              <Typography variant="body2" sx={{ marginTop: "5px" }}>
                {comment.text}
              </Typography>

              {(comment.fens || comment.fen_notations) && 
                (comment.fens || comment.fen_notations).split(',').map((fen, index) => (
                  <Box key={index} sx={{ mt: 2 }}>
                    <Typography variant="caption" sx={{ color: "gray", display: "block", mb: 1 }}>
                      Position {index + 1}:
                    </Typography>
                    <FENRenderer fen={fen.trim()} width="150" />
                  </Box>
                ))
              }
            </Box>
          )}

          {currentUsername === comment.user && !isEditing && (
            <Box sx={{ display: "flex", gap: 1, marginTop: "10px" }}>
              <IconButton
                size="small"
                color="primary"
                onClick={handleEditMode}
              >
                <EditIcon />
              </IconButton>
              <IconButton size="small" color="error" onClick={handleDelete}>
                <DeleteIcon />
              </IconButton>
            </Box>
          )}
        </Box>
      </CardContent>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default Comment;
