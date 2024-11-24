import React, { useState } from "react";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import { Form, Field } from "react-final-form";
import FENRenderer from "../common/FENRenderer";

const BACKEND_URL = process.env.REACT_APP_API_URL;

const ShareComment = ({ postId }) => {
  const [fen, setFen] = useState(null);
  const [showChessboard, setShowChessboard] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const onSubmit = async (values, form) => {
    const commentData = {
      text: values.commentContent,
      fen_notations: values.fen || "",
    };

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BACKEND_URL}/posts/comment/${postId}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(commentData),
      });

      if (response.ok) {
        const newComment = await response.json();
        setSnackbarMessage("Comment shared successfully!");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        form.reset();
        setShowChessboard(false);
        setTimeout(() => {
            window.location.reload();
          }, 1500);

      } else {
        setSnackbarMessage("Error sharing comment. Please try again.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      setSnackbarMessage("An error occurred. Please try again.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleSaveFEN = (value) => {
    setFen(value);
    setShowChessboard(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Card sx={{ width: "100%", marginTop: "20px" }}>
      <CardContent>
        <Form
          onSubmit={onSubmit}
          render={({ handleSubmit, form, submitting, form: { getState } }) => (
            <form onSubmit={handleSubmit}>
              <Field name="commentContent">
                {({ input }) => (
                  <TextField
                    {...input}
                    label="Write a comment..."
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    style={{ marginBottom: "10px" }}
                  />
                )}
              </Field>

              <Field name="fen">
                {({ input }) => (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, marginBottom: "10px" }}>
                    <TextField
                      {...input}
                      label="FEN (Optional)"
                      variant="outlined"
                      fullWidth
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleSaveFEN(getState().values.fen)}
                    >
                      Save FEN
                    </Button>
                  </Box>
                )}
              </Field>

              {showChessboard && fen && (
                <Box sx={{ marginBottom: "10px" }}>
                  <FENRenderer fen={fen} width={"250"}/>
                </Box>
              )}

              <Box sx={{ display: "flex", justifyContent: "right" }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={submitting}
                  sx={{ pl: 4, pr: 4 }}
                >
                  Share Comment
                </Button>
              </Box>
            </form>
          )}
        />
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

export default ShareComment;
