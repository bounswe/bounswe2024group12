import React, { useState } from "react";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Box,
  Snackbar,
  Alert,
  Autocomplete,
  Input,
  Typography,
} from "@mui/material";
import { Form, Field } from "react-final-form";
import FENRenderer from "./FENRenderer";

const SharePost = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [imageName, setImageName] = useState(null);
  const [fen, setFen] = useState(null);
  const [showChessboard, setShowChessboard] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const userId = 123;
  const apiURL = process.env.REACT_APP_API_URL;

  const tagOptions = ["A", "B", "C", "D", "E"];

  const onSubmit = (values, form) => {
    const postData = {
      id: userId,
      title: values.title,
      post_text: values.postContent,
      image: values.imageBase64,
      fen: values.fen,
      tags: values.tags,
    };
    fetch(apiURL + "posts/create/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    })
      .then((response) => response.json())
      .then((data) => {
        setSnackbarMessage("Post shared successfully!");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        form.reset();
        setImagePreview(null);
        setImageName(null);
        setShowChessboard(false);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      })
      .catch((error) => {
        setSnackbarMessage("Error sharing post. Please try again.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      });
  };

  const handleImageChange = (event, change) => {
    const file = event.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setImageName(file.name);

      const reader = new FileReader();
      reader.onloadend = () => {
        change("imageBase64", reader.result);
      };
      reader.readAsDataURL(file);
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
    <Card sx={{
      width: '75%',
      margin: '1% auto',
    }}>
      <CardContent sx={{
        width: '95%',
        margin: '1% auto',
      }}>
        <Form
          onSubmit={onSubmit}
          render={({ handleSubmit, form, submitting, form: { change, getState } }) => (
            <form onSubmit={handleSubmit}>
              <Field name="title">
                {({ input }) => (
                  <TextField
                    {...input}
                    label="Title"
                    variant="outlined"
                    fullWidth
                    inputProps={{ style: { fontSize: 24 } }}
                    style={{ marginBottom: "10px" }}
                  />
                )}
              </Field>

              <Field name="tags">
                {({ input }) => (
                  <Autocomplete
                    {...input}
                    multiple
                    options={tagOptions}
                    getOptionLabel={(option) => option}
                    value={Array.isArray(input.value) ? input.value : []}
                    onChange={(event, newValue) => change("tags", Array.isArray(newValue) ? newValue : [])}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Tags"
                        placeholder="Select tags"
                        style={{ marginBottom: "10px" }}
                      />
                    )}
                  />
                )}
              </Field>

              <Field name="postContent">
                {({ input }) => (
                  <TextField
                    {...input}
                    label="What's on your mind?"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    style={{ marginBottom: "10px" }}
                  />
                )}
              </Field>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 2,
                  marginBottom: "10px",
                  alignItems: "center",
                }}
              >
                <Field name="fen">
                  {({ input }) => (
                    <Box sx={{ flex: 1, display: "flex", alignItems: "center" }}>
                      <TextField
                        {...input}
                        label="FEN"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={1}
                        style={{ marginRight: "10px" }}
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

                <Field name="imageBase64">
                  {({ input }) => (
                    <Box sx={{ flex: 1, display: "flex", alignItems: "center" }}>
                      <Button variant="contained" component="label">
                        Upload Image
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(event) => handleImageChange(event, change)}
                          style={{ display: "none" }}
                        />
                      </Button>
                      {imageName && (
                        <Typography style={{ marginLeft: "10px" }}>{imageName}</Typography>
                      )}
                    </Box>
                  )}
                </Field>
              </Box>

              {(showChessboard || imagePreview) && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: 2,
                    marginBottom: "10px",
                  }}
                >
                  {showChessboard && fen && (
                    <Box
                      sx={{
                        flex: 1,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FENRenderer fen={fen} />
                    </Box>
                  )}

                  {imagePreview && (
                    <Box
                      sx={{
                        flex: 1,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{ maxWidth: "100%", maxHeight: "200px" }}
                      />
                    </Box>
                  )}
                </Box>
              )}

              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={submitting}
              >
                Share
              </Button>
            </form>
          )}
        />
      </CardContent>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default SharePost;
