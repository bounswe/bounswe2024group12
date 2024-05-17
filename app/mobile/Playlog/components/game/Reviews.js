import React, { useEffect } from 'react';
import { ScrollView, Text, View, StyleSheet } from 'react-native';
import ReviewCard from './ReviewCard';

<<<<<<< Updated upstream
export default Reviews = ({ reviews }) => {
  return (
    <View style={styles.list}>
        {reviews.reviews.map((review) => (
          <ReviewCard
            key={review.reviewId} review={review}
          />
        ))}
    </View>
  );
};

const GameReviewListCard = ({ reviews, title }) => {
    useEffect(() => {
        console.log('reviews:', reviews);
    }, []);
  return (
    <View style={styles.list}>
        {reviews.reviews.map((review) => (
=======
const exampleReviewList = [
    {
        reviewId: 0,
        game: {
            gameId: 'exampleGameId',
            logo: "https://wallpaperaccess.com/full/204728.jpg",
        },
        user: {
            username: "exampleUser",
        },
        rating: 4,
        text: "queee fue estooo. desde el principio se siente una vibra rarísima y costantemente pensas que va a pasar algo...",
        likes: 16512,
    },
    {
        reviewId: 1,
        game: {
            gameId: 'exampleGameId',
            logo: "https://wallpaperaccess.com/full/204728.jpg",
        },
        user: {
            username: "exampleUser",
        },
        rating: 4,
        text: "queee fue estooo. desde el principio se siente una vibra rarísima y costantemente pensas que va a pasar algo...",
        likes: 16512,
    },
    {
        reviewId: 2,
        game: {
            gameId: 'exampleGameId',
            logo: "https://wallpaperaccess.com/full/204728.jpg",
        },
        user: {
            username: "exampleUser",
        },
        rating: 4,
        text: "queee fue estooo. desde el principio se siente una vibra rarísima y costantemente pensas que va a pasar algo...",
        likes: 16512,
    },
    {
        reviewId: 3,
        game: {
            gameId: 'exampleGameId',
            logo: "https://wallpaperaccess.com/full/204728.jpg",
        },
        user: {
            username: "exampleUser",
        },
        rating: 4,
        text: "queee fue estooo. desde el principio se siente una vibra rarísima y costantemente pensas que va a pasar algo...",
        likes: 16512,
    },
    {
        reviewId: 4,
        game: {
            gameId: 'exampleGameId',
            logo: "https://wallpaperaccess.com/full/204728.jpg",
        },
        user: {
            username: "exampleUser",
        },
        rating: 4,
        text: "queee fue estooo. desde el principio se siente una vibra rarísima y costantemente pensas que va a pasar algo...",
        likes: 16512,
    },
];

export default GameReviewListCard = ({ reviews = exampleReviewList, title }) => {
    useEffect(() => {
        console.log('reviews:', reviews);
    }, []);
  return (
    <View style={styles.list}>
        {reviews.reviews.map((review) => (
>>>>>>> Stashed changes
          <ReviewCard
            key={review.reviewId} review={review}
          />
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    marginVertical: 0,
  },
  scrollView: {
    marginTop: 10,
  },
});
