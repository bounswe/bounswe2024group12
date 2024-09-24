import React, { useContext } from 'react';
import { Modal, View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { TextInput } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native';
import { ScrollView } from 'react-native';
import { ProfileContext } from '../../context/ProfileProvider';

const ReviewStars = ({ rating, setRating }) => {
    const filledColor = "#00E054";
    const emptyColor = "#99AABB";
    const size = 48;

    // const [rating, setRating] = useState(null);

    const handleButtonPress = (value) => {
        setRating(value);
    };

    const starColor = (value) => {
        if (rating === null) {
            return emptyColor;
        } else {
            if (value <= rating) {
                return filledColor;
            } else {
                return emptyColor;
            }
        }
    }

    return (
        <View style={reviewStarsStyles.container}>
        <View style={reviewStarsStyles.buttonContainer}>
            {[1, 2, 3, 4, 5].map((value) => (
            <TouchableOpacity key={value} onPress={() => handleButtonPress(value)}>
                <MaterialIcons name="star" size={size} color={starColor(value)} key={value} />
            </TouchableOpacity>
            ))}
        </View>
        </View>
    );
};

const TextField = ({ text, setText }) => {
    return (
        <View style={textFieldStyles.container}>
            <Text style={textFieldStyles.label}>Review:</Text>
            <TextInput
                style={textFieldStyles.textInput}
                multiline={true}
                scrollEnabled={true}
                onChangeText={setText}
                value={text}
                placeholder="Type something..."
                placeholderTextColor="#888"
            />
        </View>
    );
};

export default ReviewGamePopup = ({ game, visible, onClose, editingReview = null }) => {
    const [rating, setRating] = useState(editingReview ? editingReview.rating : null);
    const [text, setText] = useState(editingReview ? editingReview.text : '');
    const [editing, setEditing] = useState(editingReview ? true : false);
    const { username } = useContext(ProfileContext);

    const submitReview = async () => {
        if(!editingReview){
            try {
                console.log("game", game);
                console.log("rating", rating);
                console.log("text", text);
                console.log("user", username);
                console.log(`${process.env.EXPO_PUBLIC_URL}`);
                const response = await fetch(`${process.env.EXPO_PUBLIC_URL}/create-review`, {
                    method: 'POST',

                    body: JSON.stringify({ game: game.game_slug, rating, text, user: username }),

                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                console.log(response);
                console.log(response.status);

                if (response.status === 201) {
                    alert('Review created successfully')
                } else {
                    alert('Couldn\'t create review')
                    throw new Error('Couldn\'t create review');
                }
            } catch (e) {
                console.error(e);
                throw e;
            }
            // do check if text is empty or too small
            onClose();
        } else {
            try {
                console.log("editReviewId", editingReview.id );
                console.log("editRating", rating);
                console.log("editText", text);
                console.log("editUser", username);
                console.log(`${process.env.EXPO_PUBLIC_URL}`);
                const response = await fetch(`${process.env.EXPO_PUBLIC_URL}/edit-review`, {
                    method: 'POST',

                    body: JSON.stringify({ rating, text, review: editingReview.id }),

                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                console.log(response);
                console.log(response.status);

                if (response.status>=200 && response.status<300) {
                    alert('Review edited successfully')
                } else {
                    alert('Couldn\'t edit review')
                    throw new Error('Couldn\'t edit review');
                }
            } catch (e) {
                console.error(e);
                throw e;
            }
            // do check if text is empty or too small
            onClose();
        }
    }

    return (
        <Modal
          animationType="slide"
          transparent={true}
          visible={visible}
          onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose} >
                <View style={styles.centeredView}>
                    <TouchableWithoutFeedback>
                        <View style={styles.modalView}>
                            <ReviewStars rating={rating} setRating={setRating} />
                            <TextField text={text} setText={setText} />
                            <Button title="Submit Review" onPress={submitReview} />
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
      );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalView: {
        marginVertical: '5%',
        backgroundColor: "#ebebeb",
        borderRadius: 20,
        padding: '5%',
        justifyContent: 'space-evenly',
        width: '80%',
    },

});

const reviewStarsStyles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
});

const textFieldStyles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginVertical: '5%'
    },
    label: {
      fontSize: 18,
      marginBottom: 8,
    },
    textInput: {
      height: 150,
      width: '80%',
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 8,
      padding: 10,
      textAlignVertical: 'top', // Ensure text starts from the top
      backgroundColor: 'white',
    },
  });