import React, { useEffect, useState } from 'react';
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

const BACKEND_URL = process.env.REACT_APP_API_URL;

const Post = ({ post }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const postID = post.id;
  const postHeader = post.title;
  const postContent = post.post_text;
  const postImage = post.image;
  const postFen = post.fen;
  const username = post.username || "User";
  const userIcon = post.userIcon;
  const initialLikeCount = post.likeCount || 0;
  const dislikeCount = post.dislikeCount || 0;
  const commentCount = post.commentCount || 0;
  const tags = post.tags || [];
  const timestamp = new Date(post.timestamp); // Parse timestamp as Date

  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [liked, setLiked] = useState(post.liked); // Track if the post is liked

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const getImageSrc = (image, mimeType = "jpeg") => {
    if (!image) return "";
    return image.startsWith("data:") ? image : `data:image/${mimeType};base64,${image}`;
  };

  const getLikeCount = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/posts/likes_summary/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLikeCount(data.likes);
        setLiked(data.liked);
      } else {
        console.error("Failed to fetch like summary");
      }
    } catch (error) {
      console.error("An error occurred while fetching like summary:", error);
    }
  };


  const handleLikeToggle = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BACKEND_URL}/posts/like/${postID}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setLiked(!liked); // Toggle the liked state
        setLikeCount((prev) => (liked ? prev - 1 : prev + 1)); // Update like count
      } else {
        console.error("Failed to toggle like status");
      }
    } catch (error) {
      console.error("An error occurred while liking the post:", error);
    }
  };

  // Format date and time
  const formattedDate = timestamp.toLocaleDateString();
  const formattedTime = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

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

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px',
          }}
        >
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {tags.length > 0 &&
              tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  variant="filled"
                  sx={{ backgroundColor: 'secondary.main', color: '#000' }}
                />
              ))}
          </Box>
          <Typography
            variant="caption"
            sx={{ color: 'gray', textAlign: 'right', marginLeft: 'auto' }}
          >
            {formattedDate} {formattedTime}
          </Typography>
        </Box>
        <Divider sx={{ backgroundColor: 'gray', mt: '20px' }} />
        {isLoggedIn && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            borderTop: '1px solid #ddd',
            paddingTop: '10px',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={handleLikeToggle} color={liked ? "primary" : "default"}>
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
        </Box>)}
      </CardContent>
    </Card>
  );
};

export default Post;
