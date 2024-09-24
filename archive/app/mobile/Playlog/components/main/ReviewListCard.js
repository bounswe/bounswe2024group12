import React from 'react';
import { ScrollView, Text, View, StyleSheet } from 'react-native';
import ReviewCard from './MainPageReviewCard';

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

export default ReviewListCard = ({ reviews = exampleReviewList, title }) => {
  return (
    <View style={styles.list}>
      <Text style={textStyles.title}>{title}</Text>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollView}
      >
        {reviews.map((review) => (
          <ReviewCard
            key={review.game_slug} review={review}
          />
        ))}
      </ScrollView>
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
