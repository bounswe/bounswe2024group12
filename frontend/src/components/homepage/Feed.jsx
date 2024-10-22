import React, { useEffect, useState } from "react";
import Post from "./Post";
import SharePost from "./SharePost";
import { Typography, Box } from "@mui/material";

const BACKEND_URL = "https://167.99.133.190/api/v1";

const Feed = ({ isGuest }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getPosts();
  }, []);

  function getPosts() {
    fetch(BACKEND_URL + "/posts/list_items/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Filter out posts without title or content
        const filteredPosts = data.results
          .filter((post) => post.post_text && post.user)
          .map((post) => ({
            username: post.user,
            title: `${post.user}'s post:`,
            post_text: post.post_text,
            image: post.post_image || "",
            fen: post.fen || "",
            tags: post.tags || [],
            timestamp: new Date(post.created_at), // Assuming 'created_at' is the timestamp
          }))
          // Sort posts by timestamp in descending order
          .sort((a, b) => b.timestamp - a.timestamp);

        setPosts(filteredPosts);
      })
      .catch((error) => {
        console.error("Error:", error);
        setPosts([]);
      });
  }

  return (
    <div>
      {!isGuest && (
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              margin: "20px auto -3px auto",
              padding: "5px 5px",
              backgroundColor: "#769656",
              borderRadius: "10px 10px 0px 0px",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
              width: "75%",
            }}
          >
            <Typography
              variant="h6"
              style={{ textAlign: "center", fontWeight: "bold", color: "#ffffff" }}
            >
              Create Post
            </Typography>
          </Box>
          <SharePost />
        </>
      )}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          margin: "20px auto -10px auto",
          padding: "10px 20px",
          backgroundColor: "#769656",
          borderRadius: "10px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          width: "75%",
        }}
      >
        <Typography
          variant="h4"
          style={{ textAlign: "center", fontWeight: "bold", color: "#ffffff" }}
        >
          Main Feed
        </Typography>
      </Box>
      {posts.map((post, index) => (
        <Post key={index} post={post} />
      ))}
    </div>
  );
};

export default Feed;
