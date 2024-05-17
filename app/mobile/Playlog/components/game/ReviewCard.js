import React, { useContext } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
// import heart icon from material icons
import { MaterialIcons } from '@expo/vector-icons';
import SmallRatings from '../commons/SmallRatings';
import { useNavigation } from "@react-navigation/native";
import { ProfileContext } from '../../context/ProfileProvider';

const exampleReview = {
  game: {
    gameId: 'exampleGameId',
    logo: "https://wallpaperaccess.com/full/204728.jpg",
  },
  user: {
    username: "exampleUser",
    profilePicture: "https://wallpaperaccess.com/full/204728.jpg",
  },
  rating: 4,
  text: "queee fue estooo. desde el principio se siente una vibra rarísima y costantemente pensas que va a pasar algo...",
  likes: 16512,
};

export default GamePageReviewCard = ({ review = exampleReview , editReview = null}) => {
  const navigation = useNavigation();
  const {username} = useContext(ProfileContext);
  const onPress = () => {
    console.log('review:', review);
    navigation.navigate('Game', { gameId: review.game_slug });
  };

  const onEdit = () => {
    editReview(review);
  }

  const onLike = () => {
    console.log('Liked:', review);
  }

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.cardContent}>
        <View style={styles.profileContainer}>
          <MaterialIcons name='person' size={50} color='blue' />
          <Text style={styles.username}>{review.user}</Text>
        </View>
        <View style={styles.ratingContainer}>
          <SmallRatings rating={review.rating} />
          <TouchableOpacity onPress={onLike}>
            <MaterialIcons name='favorite-outline' size={30} color='red' />
          </TouchableOpacity>
          <Text style={styles.likesCount}>{review.likes} Likes</Text>
        </View>
        <View style={styles.bottom}>
          <Text style={styles.reviewText}>{review.text}</Text>
          {username === review.user && <TouchableOpacity onPress={onEdit}> 
              <MaterialIcons name='edit' size={30} color='blue' /> 
            </TouchableOpacity>}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  bottom:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#969696',
    borderRadius: 6,
    marginHorizontal: 10,
    paddingHorizontal: 2,
    paddingVertical: 5,
    marginVertical: 6,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    // width: 500,
  },
  image: {
    width: 100,
    height: 150,
    borderRadius: 5,
    margin: 10
  },
  cardContent: {
    width: 300,
    marginHorizontal: 18,
    marginVertical: 10,
  },
  profileContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },
  username: {
    marginLeft: 10,
    fontSize: 20,
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  reviewText: {
    marginTop: 10,
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  likesCount: {
    color: 'black',
  },
});
