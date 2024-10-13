import React from 'react';
import { TextField, Button, Card, CardContent, Typography } from '@mui/material';
import { Form, Field } from 'react-final-form';

const Feed = () => {
  const onSubmit = (values) => {
    console.log(values);
    // handle the post submission
  };

  return (
    <div>
      {/* Share Post Section */}
      <Card style={{ margin: '20px' }}>
        <CardContent>
          <Form
            onSubmit={onSubmit}
            render={({ handleSubmit }) => (
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
                    />
                  )}
                </Field>
                <Button type="submit" variant="contained" color="primary" style={{ marginTop: '10px' }}>
                  Share
                </Button>
              </form>
            )}
          />
        </CardContent>
      </Card>

      {/* Posts Display Section */}
      <Card style={{ margin: '20px' }}>
        <CardContent>
          <Typography variant="h6">Post 1</Typography>
          <Typography variant="body2">
            This is the content of post 1.
          </Typography>
        </CardContent>
      </Card>
      {/* You can map over your posts array here to display more posts */}
    </div>
  );
};

export default Feed;
