import React, { useState } from "react";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Box,
  Snackbar,
  Alert,
  IconButton,
  Typography,
} from "@mui/material";
import { Form, Field } from "react-final-form";
import FENRenderer from "../common/FENRenderer";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const BACKEND_URL = process.env.REACT_APP_API_URL;

const ShareComment = ({ postId }) => {
  const [comment, setComment] = useState("");
  const [fens, setFens] = useState(['']);
  const [error, setError] = useState("");

  const handleAddFen = () => {
    setFens([...fens, '']);
  };

  const handleRemoveFen = (index) => {
    const newFens = fens.filter((_, i) => i !== index);
    setFens(newFens.length ? newFens : ['']);
  };

  const handleFenChange = (index, value) => {
    const newFens = [...fens];
    newFens[index] = value;
    setFens(newFens);
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const validFens = fens.filter(fen => fen.trim());
      
      const response = await fetch(`${BACKEND_URL}/posts/comment/${postId}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          text: comment,
          fen_notations: validFens.join(',')
        }),
      });

      if (response.ok) {
        setComment("");
        setFens(['']);
        setError("");
        window.location.reload();
      } else {
        throw new Error("Failed to post comment");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      setError("Failed to post comment. Please try again.");
    }
  };

  return (
    <Card>
      <CardContent>
        <TextField
          fullWidth
          multiline
          rows={3}
          placeholder="Write a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          sx={{ marginBottom: 2 }}
        />

        {fens.map((fen, index) => (
          <Box key={index} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <TextField
              fullWidth
              label={`FEN Position ${index + 1}`}
              value={fen}
              onChange={(e) => handleFenChange(index, e.target.value)}
            />
            <IconButton 
              onClick={() => handleRemoveFen(index)}
              disabled={fens.length === 1}
            >
              <DeleteIcon />
            </IconButton>
            {fen && <FENRenderer fen={fen} width="150" />}
          </Box>
        ))}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button
            startIcon={<AddIcon />}
            onClick={handleAddFen}
            variant="outlined"
          >
            Add Another FEN
          </Button>
          
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!comment.trim() && !fens.some(fen => fen.trim())}
          >
            Post Comment
          </Button>
        </Box>

        {error && (
          <Typography color="error" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default ShareComment;
