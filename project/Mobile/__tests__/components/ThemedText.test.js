import React from 'react';
import { render } from '@testing-library/react-native';
import { ThemedText } from '../../components/ThemedText';
import { useColorScheme } from 'react-native';

jest.mock('react-native', () => ({
  ...jest.requireActual('react-native'),
  useColorScheme: jest.fn(),
}));

describe('ThemedText Component', () => {
  beforeEach(() => {
    useColorScheme.mockReset();
  });

  it('renders with default style in light mode', () => {
    useColorScheme.mockImplementation(() => 'light');
    const { getByText } = render(
      <ThemedText>Test Text</ThemedText>
    );
    expect(getByText('Test Text')).toHaveStyle({
      fontSize: 16,
      lineHeight: 24,
    });
  });

  it('renders title style correctly', () => {
    const { getByText } = render(
      <ThemedText type="title">Title Text</ThemedText>
    );
    expect(getByText('Title Text')).toHaveStyle({
      fontSize: 32,
      fontWeight: 'bold',
    });
  });

  it('applies custom styles', () => {
    const { getByText } = render(
      <ThemedText style={{ color: 'red' }}>Custom Style</ThemedText>
    );
    expect(getByText('Custom Style')).toHaveStyle({
      color: 'red',
    });
  });
});

