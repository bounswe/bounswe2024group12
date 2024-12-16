import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GameScreen from '../GameScreen';

// Mock child components
jest.mock('../../common/FENRenderer', () => {
  return function MockFENRenderer() {
    return <div data-testid="mock-fen-renderer">FEN Renderer</div>;
  };
});

describe('GameScreen', () => {
  const mockGame = {
    id: 1,
    pgn: `[Event "Test Tournament"]
[Site "Test Site"]
[Date "2024.01.01"]
[White "Player One"]
[Black "Player Two"]
[Result "1-0"]
1. e4 e5 2. Nf3 Nc6 3. Bb5 1-0`,
  };

  const mockOnMetadataClick = jest.fn();

  beforeEach(() => {
    mockOnMetadataClick.mockClear();
  });

  it('renders game metadata correctly', () => {
    render(
      <GameScreen 
        game={mockGame}
        currentUser="testUser"
        onMetadataClick={mockOnMetadataClick}
      />
    );

    expect(screen.getByText('Test Tournament')).toBeInTheDocument();
    expect(screen.getByText('Player One')).toBeInTheDocument();
    expect(screen.getByText('Player Two')).toBeInTheDocument();
    expect(screen.getByText('2024.01.01')).toBeInTheDocument();
    expect(screen.getByText('Result: 1-0')).toBeInTheDocument();
  });

  it('triggers metadata clicks correctly', () => {
    render(
      <GameScreen 
        game={mockGame}
        currentUser="testUser"
        onMetadataClick={mockOnMetadataClick}
      />
    );

    // Click event name
    fireEvent.click(screen.getByText('Test Tournament'));
    expect(mockOnMetadataClick).toHaveBeenCalledWith('event', 'Test Tournament');

    // Click player name
    fireEvent.click(screen.getByText('Player One'));
    expect(mockOnMetadataClick).toHaveBeenCalledWith('player', 'Player One');

    // Click date
    fireEvent.click(screen.getByText('2024.01.01'));
    expect(mockOnMetadataClick).toHaveBeenCalledWith('year', '2024');

    // Click result
    fireEvent.click(screen.getByText('Result: 1-0'));
    expect(mockOnMetadataClick).toHaveBeenCalledWith('result', '1-0');
  });

  it('applies clickable styles to metadata', () => {
    render(
      <GameScreen 
        game={mockGame}
        currentUser="testUser"
        onMetadataClick={mockOnMetadataClick}
      />
    );

    const eventText = screen.getByText('Test Tournament');
    expect(eventText).toHaveStyle({ cursor: 'pointer' });
  });
}); 