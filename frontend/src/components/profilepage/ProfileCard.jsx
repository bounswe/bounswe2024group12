import React, { useEffect, useState } from 'react';
import { Container, Typography, Divider, List, ListItem, ListItemText, Card, Grid, Link, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Navbar from '../common/Navbar';
import { useNavigate } from 'react-router-dom';

const BACKEND_URL = process.env.REACT_APP_API_URL;

const ProfileCard = () => {
  const [profileData, setProfileData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      fetch(`${BACKEND_URL}/accounts/me/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setProfileData(data);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  }, [navigate]);

  if (!profileData) {
    return <Typography align="center" variant="h6">Loading...</Typography>;
  }

  const handlePostClick = (id) => {
    navigate(`/posts/${id}`);
  };

  const renderList = (title, items, type, isPost = false) => (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">{title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {items.length > 0 ? (
          <List>
            {items.map((item, index) => (
              <ListItem key={index} disablePadding>
                {isPost ? (
                  <Link onClick={() => handlePostClick(item.id)} underline="hover" color="inherit">
                    <ListItemText primary={item.title} />
                  </Link>
                ) : (
                  <ListItemText 
                    primary={item.post__title || `${item.game__white} vs ${item.game__black}`} 
                    secondary={item.game__year ? `Year: ${item.game__year}` : null}
                  />
                )}
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography>Nothing here yet!</Typography>
        )}
      </AccordionDetails>
    </Accordion>
  );

  return (
    <div>
      <Navbar />
      <Container>
        <Card sx={{ my: 4, p: 3, backgroundColor: 'background.paper' }}>
          <Typography variant="h4" gutterBottom align="center">Profile</Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6">User Info</Typography>
              <Typography>Username: {profileData.username}</Typography>
              <Typography>Email: {profileData.email}</Typography>
              <Typography>Date Joined: {new Date(profileData.date_joined).toLocaleDateString()}</Typography>
              <Typography>Followers: {profileData.followers.length}</Typography>
              <Typography>Following: {profileData.following.length}</Typography>
            </Grid>
          </Grid>
          <Divider sx={{ my: 2 }} />
          {renderList('Post Bookmarks', profileData.post_bookmarks, 'post')}
          {renderList('Game Bookmarks', profileData.game_bookmarks, 'game')}
          {renderList('Game Move Bookmarks', profileData.game_move_bookmarks, 'move')}
          {renderList('Post Likes', profileData.post_likes, 'post')}
          {renderList('Followers', profileData.followers, 'follower')}
          {renderList('Following', profileData.following, 'following')}
          {renderList('My Posts', profileData.posts, 'post', true)}
        </Card>
      </Container>
    </div>
  );
};

export default ProfileCard;
