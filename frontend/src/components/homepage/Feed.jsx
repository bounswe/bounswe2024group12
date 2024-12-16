import React, { useEffect, useState } from "react";
import Post from "./Post";
import SharePost from "./SharePost";
import {
  Typography, Box, CircularProgress, Select, MenuItem,
  FormControl, InputLabel, Button, Collapse, Switch
} from "@mui/material";
import InfiniteScroll from "react-infinite-scroll-component";

const BACKEND_URL = process.env.REACT_APP_API_URL;

const Feed = ({ isGuest, passedTag }) => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [sorting, setSorting] = useState("");
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
        if (response.status === 404) {
          setHasMore(false);
          setPosts([]);
        }
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.results.length === 0) {
        setHasMore(false);
        setPosts([]);
      } else {
        const filteredPosts = data.results.filter((post) => post.post_text && post.user).map((post) => ({
          id: post.id,
          username: post.user,
          title: post.title || `${post.user}'s post`,
          post_text: post.post_text,
          image: post.post_image || "",
          fen: post.fen || "",
          tags: post.tags || [],
          timestamp: new Date(post.created_at),
        }));

        setPosts((prevPosts) =>
          [...prevPosts, ...filteredPosts].sort((a, b) => {
            if (sorting === "older") return a.timestamp - b.timestamp;
            if (sorting === "newer") return b.timestamp - a.timestamp;
            if (sorting === "title") return a.title.localeCompare(b.title);
          })
        );

        if (data.next === null) setHasMore(false);
        else setPage((prevPage) => prevPage + 1);
      }
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

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

  return (
    <div>
      {/* Only show SharePost if not a guest */}
      {!isGuest && (
        <Box sx={{ marginTop: "40px", marginBottom: "20px" }}>
          <SharePost />
        </Box>
      )}

      {/* Center the "Open Filters" Button */}
      <Box sx={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
        <Button
          onClick={() => setOpenFilters(!openFilters)}
          sx={{ backgroundColor: "secondary.main", color: "text.other" }}
        >
          {openFilters ? "Close Filters" : "Open Filters"}
        </Button>
      </Box>

      <Collapse in={openFilters} sx={{ padding: "20px", backgroundColor: "background.paper", borderRadius: "8px" }}>
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
                onChange={() => setFollowedOnly(!followedOnly)}
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
      </Collapse>

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
