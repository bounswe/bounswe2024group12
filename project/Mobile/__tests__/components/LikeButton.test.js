import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { LikeButton } from '../../components/LikeButton';

describe('LikeButton Component', () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    mockOnPress.mockClear();
  });

  it('renders correctly with initial props', () => {
    const { getByText } = render(
      <LikeButton
        isLiked={false}
        likeCount={5}
        onPress={mockOnPress}
        disabled={false}
      />
    );

    expect(getByText('5')).toBeTruthy();
  });

  it('handles press events when not disabled', () => {
    const { getByTestId } = render(
      <LikeButton
        isLiked={false}
        likeCount={0}
        onPress={mockOnPress}
        disabled={false}
      />
    );

    const button = getByTestId('like-button');
    fireEvent.press(button);
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('does not handle press events when disabled', () => {
    const { getByTestId } = render(
      <LikeButton
        isLiked={false}
        likeCount={0}
        onPress={mockOnPress}
        disabled={true}
      />
    );

    const button = getByTestId('like-button');
    fireEvent.press(button);
    expect(mockOnPress).not.toHaveBeenCalled();
  });
});

