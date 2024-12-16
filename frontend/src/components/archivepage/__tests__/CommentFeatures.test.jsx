import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import GameScreen from '../GameScreen';
import ShareComment from '../ShareComment';

// Mock fetch globally
global.fetch = jest.fn();

describe('Comment Features', () => {
    const mockGame = {
        id: 1,
        pgn: '1. e4 e5 2. Nf3 Nc6 3. Bb5',
    };

    const mockComments = {
        comments: [
            {
                id: 1,
                user: 'testUser',
                comment_text: 'Test comment',
                position_fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
                comment_fens: ''
            }
        ]
    };

    beforeEach(() => {
        fetch.mockClear();
        // Mock successful comments fetch
        fetch.mockImplementation((url) => {
            if (url.includes('/comments')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(mockComments)
                });
            }
            // Mock annotations fetch
            if (url.includes('/annotations')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({ annotations: [] })
                });
            }
            return Promise.reject(new Error('not found'));
        });
    });

    it('renders ShareComment component', () => {
        render(<GameScreen game={mockGame} currentUser="testUser" />);
        expect(screen.getByLabelText(/Write a comment/i)).toBeInTheDocument();
    });

    it('displays existing comments', async () => {
        render(<GameScreen game={mockGame} currentUser="testUser" />);
        
        await waitFor(() => {
            expect(screen.getByText('Test comment')).toBeInTheDocument();
        });
    });

    it('allows submitting a new comment', async () => {
        // Mock successful comment submission
        fetch.mockImplementationOnce((url) => {
            if (url.includes('/add_comment')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({ message: 'Comment added successfully' })
                });
            }
        });

        render(<ShareComment 
            onCommentSubmit={jest.fn()} 
            gameId={1} 
            currentFEN="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1" 
        />);

        // Type a comment
        const commentInput = screen.getByLabelText(/Write a comment/i);
        fireEvent.change(commentInput, { target: { value: 'New test comment' } });

        // Submit the comment
        const submitButton = screen.getByText(/Share Comment/i);
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(
                expect.stringContaining('/add_comment/'),
                expect.objectContaining({
                    method: 'POST',
                    headers: expect.any(Object),
                    body: expect.any(String)
                })
            );
        });
    });

    it('shows error message when comment submission fails', async () => {
        // Mock failed comment submission
        fetch.mockImplementationOnce((url) => {
            if (url.includes('/add_comment')) {
                return Promise.resolve({
                    ok: false,
                    json: () => Promise.resolve({ message: 'Error adding comment' })
                });
            }
        });

        render(<ShareComment 
            onCommentSubmit={jest.fn()} 
            gameId={1} 
            currentFEN="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1" 
        />);

        // Type a comment
        const commentInput = screen.getByLabelText(/Write a comment/i);
        fireEvent.change(commentInput, { target: { value: 'New test comment' } });

        // Submit the comment
        const submitButton = screen.getByText(/Share Comment/i);
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/Error adding comment/i)).toBeInTheDocument();
        });
    });

    it('allows adding FEN to comment', async () => {
        render(<ShareComment 
            onCommentSubmit={jest.fn()} 
            gameId={1} 
            currentFEN="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1" 
        />);

        // Add a FEN
        const fenInput = screen.getByLabelText(/FEN/i);
        const testFen = "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1";
        fireEvent.change(fenInput, { target: { value: testFen } });

        // Save FEN
        const saveFenButton = screen.getByText(/Save FEN/i);
        fireEvent.click(saveFenButton);

        // Verify FEN renderer appears
        await waitFor(() => {
            expect(screen.getByTestId('mock-chessboard')).toBeInTheDocument();
        });
    });

    it('validates empty comment submission', async () => {
        render(<ShareComment 
            onCommentSubmit={jest.fn()} 
            gameId={1} 
            currentFEN="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1" 
        />);

        // Try to submit empty comment
        const submitButton = screen.getByText(/Share Comment/i);
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/Please enter a comment/i)).toBeInTheDocument();
        });
    });
}); 