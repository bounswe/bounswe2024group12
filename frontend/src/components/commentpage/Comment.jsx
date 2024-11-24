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
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState("");
  const [editedFen, setEditedFen] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const currentUsername = localStorage.getItem("username");

  const handleEditMode = () => {
    // Prepopulate fields with existing comment values
    setEditedText(comment.text);
    setEditedFen(comment.fen || "");
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
            fen_notations: editedFen || null,
          }),
        }
      );

      if (response.ok) {
        const updatedComment = await response.json();
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
              <TextField
                fullWidth
                label="FEN (Optional)"
                value={editedFen}
                onChange={(e) => setEditedFen(e.target.value)}
                sx={{ marginBottom: "10px" }}
              />
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleEdit}
                >
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

              {comment.fen_notations && (
                <Box sx={{ marginTop: "10px" }}>
                  <Typography variant="caption" sx={{ color: "gray" }}>
                    FEN Position:
                  </Typography>
                  <FENRenderer fen={comment.fen_notations} width={"150"} />
                </Box>
              )}
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
