import React from 'react';
import { ScrollView, Text, View, StyleSheet } from 'react-native';
import ReviewCard from './ReviewCard';

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
  return (
    <View style={styles.list}>
        {reviews.map((review) => (
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
