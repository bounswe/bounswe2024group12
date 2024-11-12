import React, { useEffect, useState } from "react";
import Post from "./Post";
import SharePost from "./SharePost";
import { Typography, Box, CircularProgress } from "@mui/material";
import InfiniteScroll from "react-infinite-scroll-component";

const BACKEND_URL = process.env.REACT_APP_API_URL;

const Feed = ({ isGuest }) => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchData();
  }, [page]);

  const fetchData = async () => {

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BACKEND_URL}/posts/list_items/?page=${page}`);
      const data = await response.json();

      // Filter out posts without title or content and map to the required structure
      const filteredPosts = data.results
        .filter((post) => post.post_text && post.user)
        .map((post) => ({
          username: post.user,
          title: `${post.user}'s post:`,
          post_text: post.post_text,
          image: post.post_image || "",
          fen: post.fen || "",
          tags: post.tags || [],
          timestamp: new Date(post.created_at),
        }))
        // Sort posts by timestamp in descending order
        .sort((a, b) => b.timestamp - a.timestamp);

      // Append the filtered and sorted posts to the existing posts
      setPosts((prevPosts) => [...prevPosts, ...filteredPosts]);

      // Determine if there are more posts to load
      if (data.next === null) {
        setHasMore(false); // No more data to load
      } else {
        setPage((prevPage) => prevPage + 1); // Increment the page only if there are more posts
      }
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

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
              backgroundColor: "secondary.main",
              borderRadius: "10px 10px 0px 0px",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
              width: "50%",
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
          margin: "20px auto -20px auto",
          padding: "10px 20px",
          backgroundColor: "secondary.main",
          borderRadius: "10px 10px 0px 0px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          width: "50%",
        }}
      >
        <Typography
          variant="h4"
          style={{ textAlign: "center", fontWeight: "bold", color: "#ffffff" }}
        >
          Main Feed
        </Typography>
      </Box>
      <InfiniteScroll
        dataLength={posts.length}
        next={fetchData}
        hasMore={hasMore}
        loader={
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "20px 0",
            }}
          >
            <CircularProgress color="secondary" />
            <Typography
              variant="h6"
              sx={{ marginLeft: "10px" }}
              style={{ color: "#333" }}
            >
              Loading more posts...
            </Typography>
          </Box>
        }
        endMessage={
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "20px 0",
            }}
          >
            <Typography variant="h6" sx={{ color: "#333" }}>
              No more posts to see.
            </Typography>
          </Box>
        }
      >
        {posts.map((post, index) => (
          <Post key={index} post={post} />
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default Feed;
