import React from "react";
import { Box, Typography, Card, CardContent, Avatar, Divider } from "@mui/material";
import FENRenderer from "../common/FENRenderer";

const CommentsList = ({ comments }) => {
  const commentStyle = {
    fontSize: '1.1rem',
  };

  return (
    <Box sx={{ marginTop: 2 }}>
      {comments.map((comment, index) => (
        <Card key={index} sx={{ marginBottom: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
              <Avatar alt="User" src={comment.userIcon || ""} sx={{ marginRight: 1 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                {comment.username || "User"}
              </Typography>
            </Box>
            <Divider sx={{ marginBottom: 1 }} />
            <Typography variant="body2" sx={commentStyle}>{comment.text}</Typography>

            {comment.fen && (
              <Box sx={{ marginTop: 2, display: "flex", justifyContent: "center" }}>
                <FENRenderer fen={comment.fen} width={200} />
              </Box>
            )}

            {comment.image && (
              <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
                <img src={comment.image} alt="Comment" style={{ maxWidth: "100%", maxHeight: "200px" }} />
              </Box>
            )}
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default CommentsList;
