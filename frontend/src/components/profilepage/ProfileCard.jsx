import React, { useEffect, useState } from 'react';
import { Container, Typography, Divider, Card, Grid2, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Navbar from '../common/Navbar';
import Post from '../homepage/Post';
import { useNavigate, useParams } from 'react-router-dom'; // Import useParams for dynamic routing

const BACKEND_URL = process.env.REACT_APP_API_URL;

const ProfileCard = () => {
  const [profileData, setProfileData] = useState(null);
  const [detailedPosts, setDetailedPosts] = useState([]);
  const navigate = useNavigate();
  const { userId } = useParams(); // This gets the userId from the URL

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      const fetchProfileData = async () => {
        const endpoint = userId ? `/accounts/${userId}/` : `/accounts/me/`; // Fetch profile using userId if provided
        try {
          const response = await fetch(`${BACKEND_URL}${endpoint}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          setProfileData(data);
        } catch (error) {
          console.error('Error:', error);
        }
      };

      fetchProfileData();
    }
  }, [navigate, userId]);

  const fetchPostDetails = async (postId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/posts/${postId}/`);
      if (response.ok) {
        const data = await response.json();
        return {
          ...data,
          image: data.post_image || '',
          username: profileData.username,
          timestamp: new Date(data.created_at), // Ensure timestamp is in Date format
        };
      } else {
        console.error('Failed to fetch post details');
      }
    } catch (error) {
      console.error('Error fetching post:', error);
    }
    return null;
  };

  const renderPostList = (title, posts) => (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">{title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {posts.length > 0 ? (
          posts.map((post) => (
            <Post key={post.id} post={post} width="100%" />
          ))
        ) : (
          <Typography>Nothing here yet!</Typography>
        )}
      </AccordionDetails>
    </Accordion>
  );

  useEffect(() => {
    if (profileData && profileData.posts && detailedPosts.length === 0) {
      const fetchAllPosts = async () => {
        const updatedPosts = await Promise.all(
          profileData.posts.map(async (post) => {
            const detailedPost = await fetchPostDetails(post.id);
            return detailedPost || post;
          })
        );

        // Sort posts by timestamp (latest first)
        const sortedPosts = updatedPosts.sort((a, b) => b.timestamp - a.timestamp);
        setDetailedPosts(sortedPosts);
      };
      fetchAllPosts();
    }
  }, [profileData, detailedPosts.length]);

  if (!profileData) {
    return <Typography align="center" variant="h6">Loading...</Typography>;
  }

  return (
    <div>
      <Navbar />
      <Container>
        <Card sx={{ my: 4, p: 3, backgroundColor: 'background.paper' }}>
          <Typography variant="h4" gutterBottom align="center">Profile</Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid2 container spacing={2}>
            <Grid2 item xs={12} md={6}>
              <Typography variant="h6">User Info</Typography>
              <Typography> Username: {profileData.username} </Typography>
              <Typography>Email: {profileData.email}</Typography>
              <Typography>Date Joined: {new Date(profileData.date_joined).toLocaleDateString()}</Typography>
              <Typography>Followers: {profileData.followers.length}</Typography>
              <Typography>Following: {profileData.following.length}</Typography>
            </Grid2>
          </Grid2>
          <Divider sx={{ my: 2 }} />
          {renderPostList('My Posts', detailedPosts)}
        </Card>
      </Container>
    </div>
  );
};

export default ProfileCard;
