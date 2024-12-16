import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import Feed from '../homepage/Feed';
import HomeCard from '../homepage/HomeCard';
import Post from '../homepage/Post';
import SharePost from '../homepage/SharePost';

process.env.REACT_APP_API_URL = 'http://test-api.com';

jest.mock('chessboardjsx', () => {
  return function MockChessboard({ position, width }) {
    return (
      <div 
        data-testid="mock-chessboard"
        style={{ width: width || '400px', height: width || '400px' }}
      >
        <div>Chess Position: {position}</div>
      </div>
    );
  };
});

jest.mock('react-infinite-scroll-component', () => {
  return ({ children }) => <div data-testid="infinite-scroll">{children}</div>;
});

global.fetch = jest.fn();
global.URL.createObjectURL = jest.fn();

describe('HomeCard Component', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('renders guest view when no token is present', () => {
    render(
      <BrowserRouter>
        <HomeCard />
      </BrowserRouter>
    );
    expect(screen.getByText('Welcome, Guest!')).toBeInTheDocument();
    expect(screen.getByText(/Feel free to explore/)).toBeInTheDocument();
  });

  test('performs health check when token is present', async () => {
    localStorage.setItem('token', 'test-token');
    
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ status: 'healthy' })
    });

    render(
      <BrowserRouter>
        <HomeCard />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://test-api.com/healthcheck/hc/',
        expect.any(Object)
      );
    });
  });
});

describe('Feed Component', () => {
  const mockPosts = {
    results: [
      {
        id: 1,
        user: 'testUser',
        post_text: 'Test post',
        created_at: '2024-01-01T12:00:00Z',
        tags: ['Chess'],
        fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
      }
    ],
    next: null
  };

  const mockLikeData = [
    {
      post_id: 1,
      like_count: 5,
      liked_by_requester: false
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPosts)
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockLikeData)
      });
  });

  test('renders posts with like data', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <Feed isGuest={false} />
        </BrowserRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Main Feed')).toBeInTheDocument();
      expect(screen.getByText('Test post')).toBeInTheDocument();
    });
  });

  test('does not show SharePost component for guests', () => {
    render(
      <BrowserRouter>
        <Feed isGuest={true} />
      </BrowserRouter>
    );
    expect(screen.queryByText('Create Post')).not.toBeInTheDocument();
  });

  test('shows SharePost component for logged-in users', () => {
    localStorage.setItem('token', 'test-token');
    render(
      <BrowserRouter>
        <Feed isGuest={false} />
      </BrowserRouter>
    );
    expect(screen.getByText('Create Post')).toBeInTheDocument();
  });
});

describe('Post Component', () => {
  const mockPost = {
    id: 1,
    title: "Test Post",
    username: "testUser",
    post_text: "Test content",
    tags: ["Chess"],
    timestamp: new Date().toISOString(),
    likeCount: 5,
    liked: false,
    image: null,
    fen: null
  };

  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('renders post content correctly', () => {
    render(
      <BrowserRouter>
        <Post post={mockPost} />
      </BrowserRouter>
    );

    expect(screen.getByText('Test Post')).toBeInTheDocument();
    expect(screen.getByText('Test content')).toBeInTheDocument();
    expect(screen.getByText('Chess')).toBeInTheDocument();
  });

  test('handles like interaction when logged in', async () => {
    localStorage.setItem('token', 'test-token');
    localStorage.setItem('username', 'testUser');

    global.fetch.mockResolvedValueOnce({
      ok: true
    });

    render(
      <BrowserRouter>
        <Post post={mockPost} />
      </BrowserRouter>
    );

    const likeButton = screen.getByTestId('ThumbUpIcon').closest('button');
    fireEvent.click(likeButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://test-api.com/posts/like/1/',
        expect.any(Object)
      );
    });
  });

  test('handles delete interaction for own posts', async () => {
    localStorage.setItem('token', 'test-token');
    localStorage.setItem('username', 'testUser');

    global.fetch.mockResolvedValueOnce({
      ok: true
    });

    render(
      <BrowserRouter>
        <Post post={mockPost} />
      </BrowserRouter>
    );

    const deleteButton = screen.getByTestId('DeleteIcon').closest('button');
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://test-api.com/posts/1/',
        expect.objectContaining({
          method: 'DELETE'
        })
      );
    });
  });
});

describe('Post Component with Chess Position', () => {
  const mockPostWithChess = {
    id: 1,
    title: "Chess Position Post",
    username: "testUser",
    post_text: "Check out this position",
    fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    tags: ["Chess"],
    timestamp: new Date().toISOString(),
    likeCount: 5,
    liked: false
  };

  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('renders chess position correctly', () => {
    render(
      <BrowserRouter>
        <Post post={mockPostWithChess} />
      </BrowserRouter>
    );

    const chessboard = screen.getByTestId('mock-chessboard');
    expect(chessboard).toBeInTheDocument();
    expect(chessboard).toHaveTextContent(mockPostWithChess.fen);
  });
});

describe('SharePost Component', () => {
  beforeEach(() => {
    localStorage.setItem('token', 'test-token');
    jest.clearAllMocks();
  });

  test('renders form elements correctly', () => {
    render(<SharePost />);
    expect(screen.getByLabelText('Title')).toBeInTheDocument();
    expect(screen.getByLabelText("What's on your mind?")).toBeInTheDocument();
    expect(screen.getByText('Share')).toBeInTheDocument();
  });

  test('handles form submission', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ id: 1 })
    });

    render(<SharePost />);

    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'Test Title' }
    });

    fireEvent.change(screen.getByLabelText("What's on your mind?"), {
      target: { value: 'Test Content' }
    });

    fireEvent.click(screen.getByText('Share'));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://test-api.com/posts/create/',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-token'
          })
        })
      );
    });
  });

  test('shows success message after successful post', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ id: 1 })
    });

    render(<SharePost />);
    fireEvent.click(screen.getByText('Share'));

    await waitFor(() => {
      expect(screen.getByText('Post shared successfully!')).toBeInTheDocument();
    });
  });

  test('handles tags selection', () => {
    render(<SharePost />);
    
    const tagsInput = screen.getByLabelText('Tags');
    fireEvent.change(tagsInput, { target: { value: 'Chess' } });
    
    const option = screen.getByText('Chess');
    fireEvent.click(option);
    
    expect(tagsInput.value).toBe('');
  });

  test('handles image upload', async () => {
    render(<SharePost />);
    
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const input = screen.getByLabelText('Upload Image');
    
    Object.defineProperty(input, 'files', {
      value: [file]
    });
    
    fireEvent.change(input);
    
    expect(screen.getByText('test.png')).toBeInTheDocument();
  });
});

describe('SharePost Component with Chess Position', () => {
  beforeEach(() => {
    localStorage.setItem('token', 'test-token');
    jest.clearAllMocks();
  });

  test('handles FEN input and preview', async () => {
    render(<SharePost />);

    const fenInput = screen.getByLabelText('FEN');
    const testFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    
    fireEvent.change(fenInput, {
      target: { value: testFen }
    });

    const saveFenButton = screen.getByText('Save FEN');
    fireEvent.click(saveFenButton);

    await waitFor(() => {
      const chessboard = screen.getByTestId('mock-chessboard');
      expect(chessboard).toBeInTheDocument();
      expect(chessboard).toHaveTextContent(testFen);
    });
  });

  test('submits form with FEN position', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ id: 1 })
    });

    render(<SharePost />);

    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'Test Chess Position' }
    });

    fireEvent.change(screen.getByLabelText('FEN'), {
      target: { value: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1" }
    });

    const saveFenButton = screen.getByText('Save FEN');
    fireEvent.click(saveFenButton);

    fireEvent.click(screen.getByText('Share'));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://test-api.com/posts/create/',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-token'
          })
        })
      );
    });
  });
});