import React from "react";
import {
    Card,
    CardContent,
    Typography,
    Box,
} from "@mui/material";

const Post = ({ post }) => {
  const postHeader = post.postHeader;
  const postContent = post.postContent;
  const postImage = post.postImage;
  return (
  <Card style={{ margin: "20px" }}>
    <CardContent>
      <Typography variant="h6">{postHeader}</Typography>
      <Typography variant="body2">{postContent}</Typography>
      <Box mt={2}>
        <img src={postImage || "https://via.placeholder.com/150"} 
        alt="Example" 
        style={{ maxWidth: "100%", maxHeight: "500px" }}/>
      </Box>
    </CardContent>
  </Card>
  );
};

export default Post;