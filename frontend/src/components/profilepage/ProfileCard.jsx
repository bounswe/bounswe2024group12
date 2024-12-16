import React, { useEffect, useState } from 'react';
import { Container, Typography, Divider, Card, Grid2, Accordion, AccordionSummary, AccordionDetails, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Navbar from '../common/Navbar';
import Post from '../homepage/Post';
import { useNavigate, useParams } from 'react-router-dom';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';

const BACKEND_URL = process.env.REACT_APP_API_URL;

const ProfileCard = () => {
  const [profileData, setProfileData] = useState(null);
  const [likedPosts, setLikedPosts] = useState([]);
  const [myPosts, setMyPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const navigate = useNavigate();
  const { username } = useParams();
  const currUser = localStorage.getItem('username');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      const fetchProfileData = async () => {
        const endpoint = username && username !== currUser ? `/accounts/${username}/` : `/accounts/me/`;
        try {
          const response = await fetch(`${BACKEND_URL}${endpoint}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await response.json();
          setProfileData(data);
          setIsFollowing(data.followers.some(follower => follower.follower__username === currUser));
        } catch (error) {
          console.error('Error fetching profile data:', error);
        }
      };
      fetchProfileData();
    }
  }, [navigate, username, currUser, token]);

  const fetchPostDetails = async (postId) => {
    if (!postId) return null;
    try {
      const response = await fetch(`${BACKEND_URL}/posts/${postId}/`);
      if (response.ok) {
        const data = await response.json();
        return {
          ...data,
          likeCount: 0,
          image: data.post_image || '',
          username: data.user,
          timestamp: new Date(data.created_at),
        };
      }
    } catch (error) {
      console.error('Error fetching post:', error);
    }
    return null;
  };

  const fetchPosts = async (posts, setPosts) => {
    const postDetails = await Promise.all(
      posts.filter((post) => post.id || post.post__id).map(async (post) => {
        const postId = post.id || post.post__id;
        const detailedPost = await fetchPostDetails(postId);
        return detailedPost || post;
      })
    );
    setPosts(postDetails.sort((a, b) => b.timestamp - a.timestamp));
  };

  useEffect(() => {
    if (profileData?.posts) {
      fetchPosts(profileData.posts, setMyPosts);
    }
  }, [profileData]);

  useEffect(() => {
    if (profileData?.post_likes) {
      fetchPosts(profileData.post_likes, setLikedPosts);
    }
  }, [profileData]);

  const handleFollowToggle = async () => {
    const newIsFollowing = !isFollowing;
    setIsFollowing(newIsFollowing);

    // Update the follower count immediately
    if (newIsFollowing) {
      setProfileData((prevData) => ({
        ...prevData,
        followers: [...prevData.followers, { follower__username: currUser }], // Add the current user as a follower
      }));
    } else {
      setProfileData((prevData) => ({
        ...prevData,
        followers: prevData.followers.filter((follower) => follower.follower__username !== currUser), // Remove the current user from followers
      }));
    }

    try {
      const response = await fetch(`${BACKEND_URL}/accounts/${username}/follow/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) {
        setIsFollowing((prev) => !prev); // Revert the follow status if the backend request fails
        console.error('Failed to update follow status');
      }
    } catch (error) {
      console.error('Error toggling follow status:', error);
      setIsFollowing((prev) => !prev); // Revert the follow status if the request fails
    }
  };


  const renderPostList = (title, posts) => (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">{title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {posts.length > 0 ? (
          posts.map((post) => (
            <Post key={post.id || post.post__id} post={post} width="100%" />
          ))
        ) : (
          <Typography>Nothing here yet!</Typography>
        )}
      </AccordionDetails>
    </Accordion>
  );

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
              <Typography>Username: {profileData.username}</Typography>
              {(!username || currUser === username) && (
                <Typography>Email: {profileData.email}</Typography>
              )}
              <Typography>Date Joined: {new Date(profileData.date_joined).toLocaleDateString()}</Typography>
              <Typography>Followers: {profileData.followers.length}</Typography>
              <Typography>Following: {profileData.following.length}</Typography>
              {username && currUser !== username && (
                <Button
                  variant={isFollowing ? 'outlined' : 'contained'}
                  color={isFollowing ? 'default' : 'primary'}
                  startIcon={isFollowing ? <PersonRemoveIcon /> : <PersonAddIcon />}
                  onClick={handleFollowToggle}
                >
                  {isFollowing ? 'Unfollow' : 'Follow'}
                </Button>
              )}
            </Grid2>
          </Grid2>
          <Divider sx={{ my: 2 }} />
          {renderPostList('My Posts', myPosts)}
          <Divider sx={{ my: 2 }} />
          {renderPostList('Liked Posts', likedPosts)}
        </Card>
      </Container>
    </div>
  );
};

export default ProfileCard;
