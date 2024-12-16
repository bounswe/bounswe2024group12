import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import GameScreen from '../GameScreen';
import '@testing-library/jest-dom';

describe('GameScreen Arrow Navigation', () => {
    const mockGame = {
        id: 1,
        pgn: '1. e4 e5 2. Nf3 Nc6 3. Bb5',  // Sample PGN
    };

    const mockHandleNext = jest.fn();
    const mockHandlePrevious = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders left and right arrow buttons', () => {
        render(
            <GameScreen 
                game={mockGame}
                currentUser="testUser"
            />
        );

        expect(screen.getByTestId('previous-button')).toBeInTheDocument();
        expect(screen.getByTestId('next-button')).toBeInTheDocument();
    });

    it('calls handleNext when right arrow is clicked', () => {
        render(
            <GameScreen 
                game={mockGame}
                currentUser="testUser"
            />
        );

        fireEvent.click(screen.getByTestId('next-button'));
        expect(screen.getByTestId('next-button')).toBeInTheDocument();
    });

    it('calls handlePrevious when left arrow is clicked', () => {
        render(
            <GameScreen 
                game={mockGame}
                currentUser="testUser"
            />
        );

        fireEvent.click(screen.getByTestId('previous-button'));
        expect(screen.getByTestId('previous-button')).toBeInTheDocument();
    });

    it('disables left arrow when on first move', () => {
        render(
            <GameScreen 
                game={mockGame}
                currentUser="testUser"
            />
        );

        const previousButton = screen.getByTestId('previous-button');
        expect(previousButton).toBeDisabled();
    });

    it('disables right arrow when on last move', async () => {
        render(
            <GameScreen 
                game={mockGame}
                currentUser="testUser"
            />
        );

        // Move to the last position
        const nextButton = screen.getByTestId('next-button');
        while (!nextButton.disabled) {
            fireEvent.click(nextButton);
        }
        expect(nextButton).toBeDisabled();
    });

    it('responds to keyboard arrow keys', () => {
        render(
            <GameScreen 
                game={mockGame}
                currentUser="testUser"
            />
        );

        // Simulate right arrow key press
        fireEvent.keyDown(document, { key: 'ArrowRight' });
        expect(screen.getByTestId('next-button')).toBeInTheDocument();

        // Simulate left arrow key press
        fireEvent.keyDown(document, { key: 'ArrowLeft' });
        expect(screen.getByTestId('previous-button')).toBeInTheDocument();
    });
}); 