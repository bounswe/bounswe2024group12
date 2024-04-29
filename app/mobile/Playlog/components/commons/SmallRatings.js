import React from 'react';
import { View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default SmallRatings = ({ rating }) => {
    const filledColor = "#00E054";
    const emptyColor = "#99AABB";
    const size = 24;
    const totalStars = 5;
    const filledStars = Math.floor(rating);

    // Create an array to hold the star elements
    const starElements = [];

    // Add filled stars to the array
    for (let i = 0; i < filledStars; i++) {
        starElements.push(
        <MaterialIcons name="star" size={size} color={filledColor} key={`filled-${i}`} />
        );
    }

    // Add empty stars to the array
    for (let i = filledStars; i < totalStars; i++) {
        starElements.push(
        <MaterialIcons name="star-border" size={size} color={emptyColor} key={`empty-${i}`} />
        );
    }

    return <View style={{ flexDirection: 'row' }}>{starElements}</View>;
};
