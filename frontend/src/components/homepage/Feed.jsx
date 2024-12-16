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

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BACKEND_URL}/posts/list_posts/?page=${page}`);
      const data = await response.json();
      const filteredPosts = data.results
        .filter((post) => post.post_text && post.user)
        .map((post) => ({
          id: post.id,
          username: post.user,
          title: post.title || `${post.user}'s post:`,
          post_text: post.post_text,
          image: post.post_image || "",
          fen: post.fen || "",
          tags: post.tags || [],
          timestamp: new Date(post.created_at),
        }));

      // Fetch like data for the filtered posts
      const postIds = filteredPosts.map((post) => post.id);
      const likeData = await fetchLikeData(postIds);
      console.log("Like data:", likeData);
      // Combine the like data with the posts
      const postsWithLikes = filteredPosts.map((post) => {
        const likeInfo = likeData?.find((like) => like.post_id === post.id);
        console.log("Like info:", likeInfo);
        return {
          ...post,
          likeCount: likeInfo?.like_count || 0,
          liked: likeInfo?.liked_by_requester || false, // Set initial liked status
        };
      });

      // Update state with sorted posts including like data
      setPosts((prevPosts) =>
        [...prevPosts, ...postsWithLikes].sort((a, b) => b.timestamp - a.timestamp)
      );

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
