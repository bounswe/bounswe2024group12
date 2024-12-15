import { api } from './AuthService';

let likeChangeListeners = [];

export const likeService = {

  addLikeChangeListener(listener) {
    likeChangeListeners.push(listener);
  },

  removeLikeChangeListener(listener) {
    likeChangeListeners = likeChangeListeners.filter(l => l !== listener);
  },

  notifyLikeChange() {
    likeChangeListeners.forEach(listener => listener());
  },

  async toggleLike(postId) {
    try {
      const response = await api.post(`/posts/like/${postId}/`);
      this.notifyLikeChange();
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error('Please login to like posts');
      }
      if (error.response?.status === 500) {
        console.warn('Likes functionality not available');
        throw new Error('Liking posts is temporarily unavailable');
      }
      console.error('Like error:', error.response?.data || error.message);
      throw new Error('Unable to process like action');
    }
  },

  async getLikesSummary(postIds) {
    if (!Array.isArray(postIds) || postIds.length === 0) {
      return [];
    }

    try {
      const response = await api.post('/posts/likes_summary/', {
        post_ids: postIds
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 500 || error.response?.status === 401) {
        console.warn('Likes summary not available, returning default values');
        return postIds.map(id => ({
          post_id: id,
          like_count: 0,
          liked_by_requester: false
        }));
      }
      console.error('Like summary error:', error.response?.data || error.message);
      throw error;
    }
  }
};