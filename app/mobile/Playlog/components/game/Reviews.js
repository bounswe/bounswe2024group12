import React, { useEffect } from 'react';
import { ScrollView, Text, View, StyleSheet } from 'react-native';
import ReviewCard from './ReviewCard';

export default Reviews = ({ reviews, editReview }) => {
  return (
    <View style={styles.list}>
        {reviews.reviews.map((review) => (
          <ReviewCard
            key={review.reviewId} review={review} editReview={editReview}
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
