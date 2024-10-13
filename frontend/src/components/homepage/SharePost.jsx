import React, { useState } from "react";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Box,
} from "@mui/material";
import { Form, Field } from "react-final-form";

const SharePost = () => {
  const [imagePreview, setImagePreview] = useState(null);

  const onSubmit = (values) => {
    const formData = new FormData();
    formData.append("postContent", values.postContent);
    
    if (values.image && values.image[0]) {
      formData.append("image", values.image[0]); 
      console.log(formData.get("image"));
      console.log(formData.get("postContent"));
      console.log(formData);
    }

    fetch("/api/posts", { // TODO: Update the URL
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleImageChange = (event, change) => {
    const file = event.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      change("image", [file]);
    }
  };

  return (
    <Card style={{ margin: "20px" }}>
      <CardContent>
        <Form
          onSubmit={onSubmit}
          render={({ handleSubmit, form, submitting, form: { change } }) => (
            <form onSubmit={handleSubmit}>
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

              <Field name="image" type="file">
                {({ input }) => (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => handleImageChange(event, change)}
                    style={{ marginBottom: "10px" }}
                  />
                )}
              </Field>

              {imagePreview && (
                <Box sx={{ marginBottom: "10px" }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ maxWidth: "100%", maxHeight: "200px" }}
                  />
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
    </Card>
  );
};

export default SharePost;
