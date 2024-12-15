import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import CreatePostScreen from '../../screens/CreatePostScreen';
import { api } from '../../services/AuthService';

jest.mock('../../services/AuthService', () => ({
  api: {
    post: jest.fn(),
  },
  getAuthToken: jest.fn(),
}));

describe('CreatePostScreen', () => {
  const mockNavigation = {
    goBack: jest.fn(),
    setOptions: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form elements correctly', () => {
    const { getByPlaceholderText } = render(
      <CreatePostScreen navigation={mockNavigation} />
    );

    expect(getByPlaceholderText('Add a title...')).toBeTruthy();
    expect(getByPlaceholderText("What's on your mind?")).toBeTruthy();
  });

  it('validates required fields before submission', async () => {
    const { getByText } = render(
      <CreatePostScreen navigation={mockNavigation} />
    );

    const postButton = getByText('Post');
    fireEvent.press(postButton);

    await waitFor(() => {
      expect(getByText('Please enter a title for your post.')).toBeTruthy();
    });
  });

  it('handles tag addition and removal', () => {
    const { getByText, getByPlaceholderText } = render(
      <CreatePostScreen navigation={mockNavigation} />
    );

    fireEvent.press(getByText('Add Tags'));

    const tagInput = getByPlaceholderText('Enter tag');
    fireEvent.changeText(tagInput, 'chess');
    fireEvent.press(getByText('Add'));

    expect(getByText('#chess')).toBeTruthy();

    fireEvent.press(getByText('×'));
    expect(() => getByText('#chess')).toThrow();
  });

  it('handles successful post creation', async () => {
    api.post.mockResolvedValueOnce({ status: 201 });

    const { getByPlaceholderText, getByText } = render(
      <CreatePostScreen navigation={mockNavigation} />
    );

    fireEvent.changeText(getByPlaceholderText('Add a title...'), 'Test Title');
    fireEvent.changeText(getByPlaceholderText("What's on your mind?"), 'Test Content');
    fireEvent.press(getByText('Post'));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/posts/create/', expect.any(Object));
      expect(mockNavigation.goBack).toHaveBeenCalled();
    });
  });
});

