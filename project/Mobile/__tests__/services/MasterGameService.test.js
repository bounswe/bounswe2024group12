import { MasterGameService } from '../../services/MasterGameService';
import { api } from '../../services/AuthService';

jest.mock('../../services/AuthService', () => ({
  api: {
    get: jest.fn(),
  },
}));

describe('MasterGameService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('successfully fetches a master game by ID', async () => {
    const mockPgn = '[Event "Test Game"]';
    api.get.mockResolvedValueOnce({ data: { pgn: mockPgn } });

    const result = await MasterGameService.fetchMasterGame('12345678');

    expect(api.get).toHaveBeenCalledWith('/games/master_game/12345678');
    expect(result).toEqual({ pgn: mockPgn });
  });

  it('handles 404 error when game is not found', async () => {
    api.get.mockRejectedValueOnce({ response: { status: 404 } });

    await expect(MasterGameService.fetchMasterGame('12345678'))
      .rejects.toThrow('Game not found');
  });

  it('handles server error', async () => {
    api.get.mockRejectedValueOnce({ response: { status: 500 } });

    await expect(MasterGameService.fetchMasterGame('12345678'))
      .rejects.toThrow('Internal server error');
  });
});