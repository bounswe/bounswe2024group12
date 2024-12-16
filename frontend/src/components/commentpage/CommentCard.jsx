import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Divider } from "@mui/material";
import Post from "../homepage/Post"; // Reuse the Post component
import ShareComment from "./ShareComment"; // Import ShareComment
import Comment from "./Comment"; // Import the Comment component
import Navbar from "../common/Navbar";

const BACKEND_URL = process.env.REACT_APP_API_URL;

const CommentCard = () => {
  const { id } = useParams(); // Get post ID from the URL
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [fens, setFens] = useState([]); // Change to array of FENs

  const fetchLikeData = async (postIds) => {
    try {
      const response = await fetch(`${BACKEND_URL}/posts/likes_summary/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ post_ids: postIds }),
      });

      if (response.ok) {
        return await response.json(); // Returns an array of like data
      } else {
        console.error("Failed to fetch like data");
        return null;
      }
    } catch (error) {
      console.error("Error fetching like data:", error);
      return null;
    }
  };

  const fetchPostAndComments = async () => {
    try {
      // Fetch the post details
      const postResponse = await fetch(`${BACKEND_URL}/posts/${id}/`);
      const postData = await postResponse.json();
      const likeData = await fetchLikeData([id]);
      const mappedPost = {
        id: postData.id,
        username: postData.user,
        title: postData.title || `${postData.user}'s post:`,
        post_text: postData.post_text,
        image: postData.post_image || "",
        fen: postData.fen || "",
        tags: postData.tags || [],
        timestamp: new Date(postData.created_at),
        likeCount: likeData ? likeData[0].like_count : 0,
        liked: likeData ? likeData[0].liked_by_requester : false,
      };

      // Fetch the comments for the post
      const commentResponse = await fetch(`${BACKEND_URL}/posts/comments/${id}/`);
      const commentData = await commentResponse.json();
      console.log(commentData);

      setPost(mappedPost);
      setComments(commentData);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching post or comments:", error);
    }
  };

  useEffect(() => {
    fetchPostAndComments();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          comment: comment,
          fens: fens.join(',') // Join FENs with commas
        })
      });
      // ... rest of submit handling
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const handleAddFen = (fen) => {
    setFens([...fens, fen]); // Add new FEN to array
  };

  const handleRemoveFen = (index) => {
    setFens(fens.filter((_, i) => i !== index)); // Remove FEN at index
  };

  if (isLoading) return <Typography>Loading...</Typography>;

  return (
    <>
    <Navbar/>
    <Box sx={{ display: "flex", margin: "20px" }}>
      <Box sx={{ flex: 3 }}>
        <Post post={post} width={"75%"} />
      </Box>

      <Box sx={{ flex: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", mt: "20px" }}>
          Comments
        </Typography>

        <ShareComment postId={id} />
        <Divider sx={{ margin: "20px 0" }} />

        {comments.map((comment, index) => (
          <Comment
            key={index}
            comment={comment}
            postId={id}
            onDelete={(commentId) =>
              setComments((prev) => prev.filter((c) => c.id !== commentId))
            }
          />
        ))}
      </Box>
    </Box>
    </>
  );
};

export default CommentCard;
