import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  IconButton,
  Chip,
  Divider,
} from "@mui/material";
import FENRenderer from "../common/FENRenderer";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ShareIcon from "@mui/icons-material/Share";
import CommentIcon from "@mui/icons-material/Comment";

const Post = ({ post }) => {
  const postHeader = post.title;
  const postContent = post.post_text;
  const postImage = post.image;
  const postFen = post.fen;
  const username = post.username || "User";
  const userIcon = post.userIcon;
  const likeCount = post.likeCount || 0;
  const dislikeCount = post.dislikeCount || 0;
  const commentCount = post.commentCount || 0;
  const tags = post.tags || [];

  const getImageSrc = (image, mimeType = "jpeg") => {
    if (!image) return "";
    return image.startsWith("data:") ? image : `data:image/${mimeType};base64,${image}`;
  };

  return (
    <Card sx={{ width: '50%', margin: '1% auto' }}>
      <CardContent sx={{ width: '95%', margin: '1% auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {postHeader}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ marginRight: '10px' }}>
              {username}
            </Typography>
            <Avatar alt={username} src={getImageSrc(userIcon, "png")} />
          </Box>
        </Box>

        <Divider sx={{ backgroundColor: 'gray', marginBottom: '10px' }} />
        
        <Typography variant="body2" sx={{ marginBottom: '20px' }}>
          {postContent}
        </Typography>

        {(postFen || postImage) && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            mb={2}
          >
            {postFen && (
              <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <FENRenderer fen={postFen} />
              </Box>
            )}

            {postImage && (
              <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <img 
                  src={getImageSrc(postImage)} 
                  alt="Post" 
                  style={{ maxWidth: "100%", maxHeight: "500px" }}
                />
              </Box>
            )}
          </Box>
        )}

        {tags.length > 0 && (
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', marginBottom: '10px'}}>
            {tags.map((tag, index) => (
              <Chip key={index} label={tag} variant="filled" 
                sx={{ backgroundColor: 'secondary.main', color: '#000' }} 
              />
            ))}
          </Box>
        )}

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            marginTop: '10px',
            borderTop: '1px solid #ddd',
            paddingTop: '10px',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton>
              <ThumbUpIcon />
            </IconButton>
            <Typography variant="body2">{likeCount}</Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton>
              <ThumbDownIcon />
            </IconButton>
            <Typography variant="body2">{dislikeCount}</Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton>
              <CommentIcon />
            </IconButton>
            <Typography variant="body2">{commentCount}</Typography>
          </Box>

          <IconButton>
            <ShareIcon />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default Post;