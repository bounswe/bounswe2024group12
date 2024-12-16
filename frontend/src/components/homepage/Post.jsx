import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from "react-router-dom"; // Import Link here
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
import DeleteIcon from "@mui/icons-material/Delete";
import ShareIcon from "@mui/icons-material/Share";
import CommentIcon from "@mui/icons-material/Comment";
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';

const BACKEND_URL = process.env.REACT_APP_API_URL;

const Post = ({ post, width }) => {
  const postWidth = width || '50%';
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const currUser = localStorage.getItem('username');
  const postID = post.id;
  const postHeader = post.title;
  const postContent = post.post_text;
  const postImage = post.image;
  const postFen = post.fen;
  const username = post.username || "User";
  const userIcon = post.userIcon;
  const initialLikeCount = post.likeCount || 0;
  const commentCount = post.commentCount || 0;
  const tags = post.tags || [];
  const timestamp = new Date(post.timestamp); // Parse timestamp as Date

  const [like_count, setLikeCount] = useState(post.likeCount || 0);
  const [liked, setLiked] = useState(post.liked || false); // Track if the post is liked
  const [bookmarked, setBookmarked] = useState(post.bookmarked || false);

  const navigate = useNavigate();

  useEffect(() => {
    setLikeCount(initialLikeCount);
    setLiked(post.liked || false);
    setBookmarked(post.bookmarked || false);
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, [post.likeCount, post.liked, post.bookmarked]);

  const getImageSrc = (image, mimeType = "jpeg") => {
    if (!image) return "";
    return image.startsWith("data:") ? image : `data:image/${mimeType};base64,${image}`;
  };

  const handleLikeToggle = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/posts/like/${postID}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
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

  const handleBookmarkToggle = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/posts/bookmark/${postID}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        setBookmarked(!bookmarked); // Toggle the bookmarked state
      } else {
        console.error("Failed to toggle bookmark status");
      }
    } catch (error) {
      console.error("An error occurred while bookmarking the post:", error);
    }
  };

  const handleDelete = async () => {
    if (!isLoggedIn) return;
    try {
      const response = await fetch(`${BACKEND_URL}/posts/${postID}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        console.log("Post deleted successfully");
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        console.error("Failed to delete post");
      }
    } catch (error) {
      console.error("An error occurred while deleting the post:", error);
    }
  };

  const handleShare = () => {
    console.log("Sharing post:", postID);
    navigator.clipboard
      .writeText(`${window.location.origin}/post/${postID}/comments`)
      .then(() => {
        alert("Post link copied to clipboard!");
      })
      .catch(() => {
        alert("Failed to copy link!");
      });
  };

  // Format date and time
  const formattedDate = timestamp.toLocaleDateString();
  const formattedTime = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Handle tag click to navigate to feed with the selected tag
  const handleTagClick = (tag) => {
    navigate(`/home/${tag}`); // Navigate to the feed with the selected tag
  };

  return (
    <Card sx={{ width: postWidth, margin: '1% auto' }}>
      <CardContent sx={{ width: '95%', margin: '1% auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {postHeader}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Link to={`/profile/${username}`} style={{ textDecoration: 'none' }}>
              <Typography variant="h6" sx={{ marginRight: '10px' }}>
                {username}
              </Typography>
            </Link>
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
                <FENRenderer fen={postFen} width={300} />
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
                  sx={{ backgroundColor: 'secondary.main', color: '#000', cursor: 'pointer' }}
                  onClick={() => handleTagClick(tag)} // Handle tag click
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
              <Typography variant="body2">{like_count}</Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton onClick={() => navigate(`/post/${postID}/comments`)}>
                <CommentIcon />
              </IconButton>
              <Typography variant="body2">{commentCount}</Typography>
            </Box>

            <IconButton onClick={handleShare}>
              <ShareIcon />
            </IconButton>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton onClick={handleBookmarkToggle} color={bookmarked ? "primary" : "default"}>
                {bookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
              </IconButton>
            </Box>

            {(currUser === username) && (<IconButton onClick={handleDelete}>
              <DeleteIcon />
            </IconButton>)}

          </Box>)}
      </CardContent>
    </Card>
  );
};

export default Post;
