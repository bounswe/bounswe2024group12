import React, { useEffect, useState } from "react";
import Post from "./Post";
import SharePost from "./SharePost";
import {
  Typography, Box, CircularProgress, Select, MenuItem,
  FormControl, InputLabel, Button, Collapse, Switch
} from "@mui/material";
import InfiniteScroll from "react-infinite-scroll-component";
import { use } from "react";

const BACKEND_URL = process.env.REACT_APP_API_URL;

const Feed = ({ isGuest, passedTag }) => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [sorting, setSorting] = useState("newer");
  const [selectedTag, setSelectedTag] = useState(passedTag || ""); // Initialize with URL tag
  const [openFilters, setOpenFilters] = useState(false);
  const [followedOnly, setFollowedOnly] = useState(false);

  const tagOptions = ["Chess", "Opening", "Endgame", "Tactics", "Strategy"];

  useEffect(() => {
    setSelectedTag(passedTag || ""); // Set selectedTag based on passedTag prop
    setPage(1); // Reset to first page when tag changes
    setPosts([]); // Clear previous posts
  }, [passedTag]); // This will trigger when passedTag changes

  useEffect(() => {
    fetchData(); // Fetch data when parameters change
  }, [page, sorting, selectedTag, followedOnly]); // Re-fetch when parameters change

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const headers = token ? { "Authorization": `Bearer ${token}` } : {};

      // Start building the query string with page
      let queryParams = new URLSearchParams({ page: page });

      // Conditionally add query parameters
      if (sorting) queryParams.append("order_by", sorting);
      if (selectedTag) queryParams.append("tag", selectedTag);
      if (followedOnly) queryParams.append("followed", followedOnly);

      const response = await fetch(
        `${BACKEND_URL}/posts/list_posts/?${queryParams.toString()}`,
        { headers }
      );

      if (!response.ok) {
        // Handle the 404 error when there are no more posts
        if (response.status === 404) {
          setHasMore(false); // Disable infinite scroll since there are no more posts
          return; // Prevent further actions if no more posts
        }
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.results.length === 0) {
        setHasMore(false); // No posts left to load
      } else {
        const filteredPosts = data.results
          .filter((post) => post.post_text && post.user)
          .map((post) => ({
            id: post.id,
            username: post.user,
            title: post.title || `${post.user}'s post`,
            post_text: post.post_text,
            image: post.post_image || "",
            fen: post.fen || "",
            tags: post.tags || [],
            timestamp: new Date(post.created_at),
          }));

        setPosts((prevPosts) => {
          const newPosts = [...prevPosts, ...filteredPosts];
          const uniquePosts = [];

          // Create a Set to track unique post ids
          const postIds = new Set();

          // Filter out posts with duplicate ids
          newPosts.forEach(post => {
            if (!postIds.has(post.id)) {
              uniquePosts.push(post);
              postIds.add(post.id); // Mark the id as seen
            }
          });

          // Sort unique posts
          return uniquePosts.sort((a, b) => {
            if (sorting === "older") return a.timestamp - b.timestamp;
            if (sorting === "newer") return b.timestamp - a.timestamp;
            if (sorting === "title") return a.title.localeCompare(b.title);
          });
        });


        if (data.next === null) {
          setHasMore(false); // No more pages to load
        } else {
          setPage((prevPage) => prevPage + 1); // Increase page number for next request
        }
      }
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check if there are posts to fetch like summary for
    if (posts.length === 0) return;

    const fetchLikeSummary = async () => {
      try {
        const postIds = posts.map((post) => post.id); // Collect all post IDs
        const response = await fetch(`${BACKEND_URL}/posts/likes_summary/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ post_ids: postIds }), // Send post IDs
        });

        if (response.ok) {
          const likeSummary = await response.json();

          // Update the posts with the like count and liked status
          setPosts((prevPosts) =>
            prevPosts.map((post) => {
              const summary = likeSummary.find(
                (item) => item.post_id === post.id
              );
              if (summary) {
                post.likeCount = summary.like_count;
                post.liked = summary.liked_by_requester;
              }
              return post;
            })
          );
        } else {
          console.error("Failed to fetch like summary");
        }
      } catch (error) {
        console.error("An error occurred while fetching like summary:", error);
      }
    };

    fetchLikeSummary();
  }, [page, sorting, selectedTag, followedOnly]);

  const handleTagChange = (tag) => {
    setSelectedTag(tag);
    setPage(1); // Reset to first page when tag changes
    setPosts([]); // Clear previous posts
  };

  const handleSortChange = (sort) => {
    setSorting(sort);
    setPage(1); // Reset to first page when sorting changes
    setPosts([]); // Clear previous posts
  };

  const handleFollowedChange = () => {
    setFollowedOnly(!followedOnly);
    setPage(1); // Reset to first page when followedOnly changes
    setPosts([]); // Clear previous posts
  }

  return (
    <div>
      {/* Only show SharePost if not a guest */}
      {!isGuest && (
        <Box sx={{ marginTop: "40px", marginBottom: "20px" }}>
          <SharePost />
        </Box>
      )}

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          margin: "20px auto",  // Adjusted margin for proper spacing
          padding: "10px 20px",
          backgroundColor: "secondary.main",
          borderRadius: "10px 10px 0px 0px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          width: "60%",  // Increased width for more room
        }}
      >
        <Typography
          variant="h4"
          style={{ textAlign: "center", fontWeight: "bold", color: "#ffffff" }}
        >
          Main Feed
        </Typography>
      </Box>

      {/* Center the "Open Filters" Button */}
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <Button
          onClick={() => setOpenFilters(!openFilters)}
          sx={{ backgroundColor: "secondary.main", color: "text.other" }}
        >
          {openFilters ? "Close Filters" : "Open Filters"}
        </Button>
      </Box>


      {/* Filter section */}
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        {openFilters && (
          <Box
            sx={{
              padding: "20px",
              backgroundColor: "background.paper",
              borderRadius: "8px",
              maxWidth: '600px',
              width: '100%'
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Sort and Tag Select Controls */}
              <Box sx={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                <FormControl fullWidth>
                  <InputLabel>Sort by</InputLabel>
                  <Select value={sorting} onChange={(e) => handleSortChange(e.target.value)}>
                    <MenuItem value="newer">Newest</MenuItem>
                    <MenuItem value="older">Oldest</MenuItem>
                    <MenuItem value="title">Title</MenuItem>
                  </Select>
                </FormControl>


                <FormControl fullWidth>
                  <InputLabel>Tag</InputLabel>
                  <Select value={selectedTag} onChange={(e) => handleTagChange(e.target.value)}>
                    <MenuItem value="">All</MenuItem>
                    {tagOptions.map((tag, index) => (
                      <MenuItem key={index} value={tag}>{tag}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Followed Only Switch */}
              <Box display="flex" flexDirection="column" alignItems="flex-start">
                <Box display="flex" alignItems="center">
                  <Typography sx={{ color: "text.primary", marginRight: "10px" }}>
                    Followed Only
                  </Typography>
                  <Switch
                    checked={followedOnly}
                    onChange={handleFollowedChange}
                    color="primary"
                    disabled={isGuest}
                  />
                </Box>

                {isGuest && (
                  <Typography sx={{ color: "text.secondary", fontSize: "12px", marginTop: "5px" }}>
                    For this feature, you must have an account!
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
        )}
      </Box>

      {posts.length === 0 && !hasMore && (
        <Typography sx={{ color: "text.primary", textAlign: "center", marginTop: "20px" }}>
          No posts to see here.
        </Typography>
      )}

      <InfiniteScroll
        dataLength={posts.length}
        next={fetchData}
        hasMore={hasMore}
        loader={<CircularProgress color="secondary" />}
      >
        {posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default Feed;
