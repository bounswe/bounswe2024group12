import { api } from './AuthService';

export const MasterGameService = {
  /**
   * Fetches a specific master game's PGN by its ID
   * @param {string} gameId - The 8-character ID of the game
   * @returns {Promise<{pgn: string}>}
   * @throws {Error} When game is not found or server error occurs
   */
  fetchMasterGame: async (gameId) => {
    try {
      const response = await api.get(`/games/master_game/${gameId}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Game not found');
      } else if (error.response?.status === 500) {
        throw new Error('Internal server error');
      } else {
        throw new Error('Failed to fetch game details');
      }
    }
  }
};