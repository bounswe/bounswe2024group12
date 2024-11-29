import { likeService } from '../../services/LikeService';
import { api } from '../../services/AuthService';

jest.mock('../../services/AuthService', () => ({
  api: {
    post: jest.fn(),
  }
}));

describe('LikeService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('toggleLike', () => {
    it('successfully toggles like on a post', async () => {
      const mockResponse = { data: { liked: true } };
      api.post.mockResolvedValueOnce(mockResponse);

      const result = await likeService.toggleLike(123);

      expect(api.post).toHaveBeenCalledWith('/posts/like/123/');
      expect(result).toEqual(mockResponse.data);
    });

    it('handles unauthorized like attempts', async () => {
      api.post.mockRejectedValueOnce({ response: { status: 401 } });

      await expect(likeService.toggleLike(123))
        .rejects.toThrow('Please login to like posts');
    });
  });

  describe('getLikesSummary', () => {
    it('fetches likes summary for multiple posts', async () => {
      const mockResponse = {
        data: [
          { post_id: 1, like_count: 5, liked_by_requester: true },
          { post_id: 2, like_count: 3, liked_by_requester: false }
        ]
      };
      api.post.mockResolvedValueOnce(mockResponse);

      const result = await likeService.getLikesSummary([1, 2]);

      expect(api.post).toHaveBeenCalledWith('/posts/likes_summary/', {
        post_ids: [1, 2]
      });
      expect(result).toEqual(mockResponse.data);
    });

    it('returns empty array for empty post ids', async () => {
      const result = await likeService.getLikesSummary([]);
      expect(result).toEqual([]);
      expect(api.post).not.toHaveBeenCalled();
    });
  });
});

