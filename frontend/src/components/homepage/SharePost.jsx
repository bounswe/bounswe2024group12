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
import FENRenderer from "../common/FENRenderer";

const BACKEND_URL = process.env.REACT_APP_API_URL;

const SharePost = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [imageName, setImageName] = useState(null);
  const [fen, setFen] = useState(null);
  const [showChessboard, setShowChessboard] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const tagOptions = ["Chess", "Opening", "Endgame", "Tactics", "Strategy"];

  const onSubmit = (values, form) => {
    const postData = {
      title: values.title,
      post_text: values.postContent,
      post_image: values.imageBase64,
      fen: values.fen,
      tags: values.tags,
    };
    console.log(postData);
    const token = localStorage.getItem("token");
    fetch(BACKEND_URL + "/posts/create/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
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
      width: '50%',
      margin: '0 auto 1% auto',
      borderRadius: "0px 0px 10px 10px",
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
                    sx={{
                      marginBottom: "10px",
                      "& .MuiInputLabel-root": {
                        fontSize: "24px",
                      },
                      "& .MuiInputBase-input": {
                        fontSize: "24px",
                      }
                    }}
                  />
                )}
              </Field>

              <Field name="tags">
                {({ input }) => (
                  <Autocomplete
                    {...input}
                    multiple
                    freeSolo
                    options={tagOptions}
                    getOptionLabel={(option) => option}
                    value={Array.isArray(input.value) ? input.value : []}
                    onChange={(event, newValue) => change("tags", Array.isArray(newValue) ? newValue : [])}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Tags"
                        placeholder="Select or add tags"
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
                    <Box sx={{ flex: 1, display: 'flex', gap: 2, marginBottom: 2, justifyContent: "space-around" }}>
                      <Button variant="contained" component="label">
                        Upload Image
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(event) => handleImageChange(event, change)}
                          style={{ display: "none" }}
                        />
                      </Button>
                      {imageName && <Typography style={{ ml: 1, mt: 1 }}>{imageName}</Typography>}
                      {!imageName && <Typography sx={{ ml: 1, mt: 1 }}>No file chosen.</Typography>}
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
              <Box sx={{ display: "flex", justifyContent: "right" }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={submitting}
                  sx={{ pl: 5, pr: 5 }}
                >
                  Share
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
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default SharePost;
