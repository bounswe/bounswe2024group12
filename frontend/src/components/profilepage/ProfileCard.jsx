import React, { useEffect, useState } from 'react';
import { Container, Typography, Divider, Card, Grid2, Accordion, AccordionSummary, AccordionDetails, Button, Link } from '@mui/material';
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
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
  const [bookmarkedGames, setBookmarkedGames] = useState([]);
  const [bookmarkedGameMoves, setBookmarkedGameMoves] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
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
    const postIds = posts.filter(post => post.id || post.post__id).map(post => post.id || post.post__id);

    // Fetch like counts for all posts at once
    const likeSummaryResponse = await fetch(`${BACKEND_URL}/posts/likes_summary/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ post_ids: postIds })
    });

    const likeSummary = await likeSummaryResponse.json();
    const likeSummaryMap = likeSummary.reduce((acc, { post_id, like_count, liked_by_requester }) => {
      if (post_id) {
        acc[post_id] = { likeCount: like_count, likedByRequester: liked_by_requester };
      }
      return acc;
    }, {});

    // Fetch the post details and merge like summary with the posts
    const postDetails = await Promise.all(
      posts.filter((post) => post.id || post.post__id).map(async (post) => {
        const postId = post.id || post.post__id;
        const detailedPost = await fetchPostDetails(postId);

        // Add the like count and like status from the likeSummary
        const likeData = likeSummaryMap[postId] || { likeCount: 0, likedByRequester: false };
        return {
          ...detailedPost,
          likeCount: likeData.likeCount,
          liked: likeData.likedByRequester,
        };
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

  useEffect(() => {
    if (profileData?.post_bookmarks) {
      fetchPosts(profileData.post_bookmarks, (posts) => {
        // Add 'bookmarked: true' to each post in the list
        const bookmarkedPostsWithFlag = posts.map(post => ({
          ...post,
          bookmarked: true,
        }));
        setBookmarkedPosts(bookmarkedPostsWithFlag);
      });
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
    <Accordion sx={(theme) => ({
      backgroundColor: theme.palette.grey[50],
      boxShadow: theme.shadows[2],
      border: `2px solid ${theme.palette.divider}`,
      '& .MuiAccordionSummary-root': {
        backgroundColor: theme.palette.grey[50],
        borderBottom: `2px solid ${theme.palette.divider}`,
      },
      '& .MuiAccordionDetails-root': {
        backgroundColor: theme.palette.background.paper,
        '& > div': {
          borderRadius: 1,
          padding: '4px',
          margin: '8px 0',
          borderLeft: `3px solid ${theme.palette.primary.light}`,
          borderBottom: `1px solid ${theme.palette.divider}`,
          '&:last-child': {
            borderBottom: 'none'
          }
        }
      }
    })}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
      >
        <Typography variant="h6" sx={(theme) => ({
          color: theme.palette.text.primary,
          fontWeight: 500
        })}>
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ padding: 2 }}>
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id || post.post__id}>
              <Post post={post} width="100%" />
            </div>
          ))
        ) : (
          <Typography sx={(theme) => ({
            color: theme.palette.text.secondary,
            fontStyle: 'italic'
          })}>
            No posts yet!
          </Typography>
        )}
      </AccordionDetails>
    </Accordion>
  );

  const renderFollowersFollowing = (title, users, isFollower) => (
    <Accordion sx={(theme) => ({
      backgroundColor: theme.palette.grey[50],
      boxShadow: theme.shadows[2],
      border: `2px solid ${theme.palette.divider}`,
      '& .MuiAccordionSummary-root': {
        backgroundColor: theme.palette.grey[50],
        borderBottom: `2px solid ${theme.palette.divider}`,
      },
      '& .MuiAccordionDetails-root': {
        backgroundColor: theme.palette.background.paper
      }
    })}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        onClick={() => (title === 'Followers' ? setShowFollowers(!showFollowers) : setShowFollowing(!showFollowing))}
      >
        <Typography variant="body2" sx={(theme) => ({
          fontWeight: 'bold',
          color: theme.palette.text.primary
        })}>
          <strong>{title}:</strong>
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{
        padding: 2,
        '& > .MuiTypography-root': {
          padding: '4px 8px',
          borderRadius: 1,
          ...(users.length > 0 && {
            '&:hover': {
              backgroundColor: theme => theme.palette.background.default,
              boxShadow: theme => theme.shadows[1]
            }
          })
        }
      }}>
        {users.length > 0 ? (
          users.map((user) => (
            <Typography
              key={user.follower__username || user.follower_username || user.following__username || user.following_username}
              sx={(theme) => ({
                ml: 2,
                color: theme.palette.primary.main,
                cursor: 'pointer',
                '&:hover': {
                  textDecoration: 'underline',
                  color: theme.palette.primary.dark,
                  backgroundColor: theme.palette.background.default
                },
              })}
              onClick={() => navigate(`/profile/${user.follower__username || user.follower_username || user.following__username || user.following_username}`)}
            >
              {user.follower__username || user.follower_username || user.following__username || user.following_username}
            </Typography>
          ))
        ) : (
          <Typography sx={(theme) => ({
            color: theme.palette.text.secondary,
            fontStyle: 'italic'
          })}>
            No {title.toLowerCase()} yet!
          </Typography>
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
        <Card sx={(theme) => ({
          my: 4,
          p: 3,
          backgroundColor: theme.palette.background.paper,
          boxShadow: theme.shadows[3],
          borderRadius: 2
        })}>
          <Typography variant="h4" gutterBottom align="center"
            sx={(theme) => ({ color: theme.palette.text.primary })}>
            Profile
          </Typography>
          <Divider sx={(theme) => ({ mb: 2, backgroundColor: theme.palette.divider })} />
          <Grid2 container spacing={2}>
            <Grid2 item xs={12} md={6}>
              <Typography variant="h6" sx={(theme) => ({
                color: theme.palette.text.primary,
                mb: 2
              })}>User Info</Typography>
              <Typography sx={(theme) => ({
                color: theme.palette.text.secondary,
                mb: 1
              })}>Username: {profileData.username}</Typography>
              {(!username || currUser === username) && (
                <Typography sx={(theme) => ({
                  color: theme.palette.text.secondary,
                  mb: 1
                })}>Email: {profileData.email}</Typography>
              )}
              <Typography sx={(theme) => ({
                color: theme.palette.text.secondary,
                mb: 1
              })}>Date Joined: {new Date(profileData.date_joined).toLocaleDateString()}</Typography>
              <Typography sx={(theme) => ({
                color: theme.palette.text.secondary,
                mb: 1
              })}>Followers: {profileData.followers.length}</Typography>
              <Typography sx={(theme) => ({
                color: theme.palette.text.secondary,
                mb: 1
              })}>Following: {profileData.following.length}</Typography>
              {username && currUser !== username && (
                <Button
                  variant={isFollowing ? 'outlined' : 'contained'}
                  color="primary"
                  startIcon={isFollowing ? <PersonRemoveIcon /> : <PersonAddIcon />}
                  onClick={handleFollowToggle}
                  sx={(theme) => ({
                    marginTop: 2,
                    fontWeight: 'bold',
                    textTransform: 'none',
                    backgroundColor: isFollowing ? 'transparent' : theme.palette.primary.main,
                    color: isFollowing ? theme.palette.text.primary : theme.palette.primary.contrastText,
                    borderColor: isFollowing ? theme.palette.text.primary : 'transparent',
                    '&:hover': {
                      backgroundColor: isFollowing ? theme.palette.action.hover : theme.palette.primary.dark,
                      borderColor: isFollowing ? theme.palette.text.primary : 'transparent',
                    }
                  })}
                >
                  {isFollowing ? 'Unfollow' : 'Follow'}
                </Button>
              )}
            </Grid2>

            <Grid2 item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <Typography variant="h6" sx={(theme) => ({
                color: theme.palette.text.primary,
                mb: 2
              })}>Followers & Following</Typography>
              {renderFollowersFollowing('Followers', profileData.followers, true)}
              {renderFollowersFollowing('Following', profileData.following, false)}
            </Grid2>
          </Grid2>
          <Divider sx={{ my: 2 }} />
          {(!username || currUser === username) && // Only show bookmarks for the current user
            <>
              {renderPostList('Bookmarked Posts', bookmarkedPosts)}
              <Divider sx={{ my: 2 }} />
              {renderPostList('Bookmarked Games', bookmarkedGames)}
              <Divider sx={{ my: 2 }} />
              {renderPostList('Bookmarked Game Moves', bookmarkedGameMoves)}
              <Divider sx={{ my: 2 }} />
            </>
          }
          <Divider sx={{ my: 2 }} />
          {renderPostList(username ? `${username}'s Posts` : 'Posts', myPosts)}
          <Divider sx={(theme) => ({ my: 2, backgroundColor: theme.palette.divider })} />
          {renderPostList(username ? `${username}'s Liked Posts` : 'Liked Posts', likedPosts)}
        </Card>
      </Container>
    </div>
  );
};

export default ProfileCard;
