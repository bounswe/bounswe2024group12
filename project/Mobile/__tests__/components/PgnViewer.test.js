import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PgnViewer } from '../../components/PgnViewer';

describe('PgnViewer Component', () => {
  const samplePgn = `[Event "Test Game"]
  [Site "Chess Forum"]
  [Date "2024.01.01"]
  [White "Player1"]
  [Black "Player2"]
  [Result "1-0"]

  1. e4 e5 2. Nf3 Nc6 3. Bb5 1-0`;

  it('renders correctly with valid PGN', () => {
    const { getByText } = render(<PgnViewer pgn={samplePgn} />);
    expect(getByText('Test Game')).toBeTruthy();
    expect(getByText('Player1')).toBeTruthy();
    expect(getByText('Player2')).toBeTruthy();
  });

  it('handles empty PGN', () => {
    const { getByText } = render(<PgnViewer pgn="" />);
    expect(getByText('No PGN provided, resetting to initial position')).toBeTruthy();
  });

  it('handles playback controls', () => {
    const { getByLabelText } = render(<PgnViewer pgn={samplePgn} />);

    const nextButton = getByLabelText('Go to next move');
    const prevButton = getByLabelText('Go to previous move');

    fireEvent.press(nextButton);
    fireEvent.press(prevButton);

    expect(getByLabelText('Go to previous move')).toBeDisabled();
  });
});

