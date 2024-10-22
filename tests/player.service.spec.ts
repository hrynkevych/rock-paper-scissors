import { GamePlayersService } from '../src/game/services/game-players.service';

describe('PlayerService', () => {
  let playerService: GamePlayersService;

  beforeEach(() => {
    playerService = new GamePlayersService();
  });

  it('should register a new player', () => {
    const socketId = 'socket1';
    const result = playerService.registerPlayer('Player1', socketId);
    
    expect(result.username).toBe('Player1');
    expect(playerService.getPlayers()[socketId].username).toBe('Player1');
  });

  it('should find the opponent of a player', () => {
    playerService.registerPlayer('Player1', 'socket1');
    playerService.registerPlayer('Player2', 'socket2');

    const opponent = playerService.findOpponent('socket1');
    expect(opponent?.username).toBe('Player2');
  });

  it('should remove a player from the game', () => {
    const socketId = 'socket1';
    playerService.registerPlayer('Player1', socketId);

    expect(playerService.getPlayers()[socketId]).toBeDefined();

    playerService.removePlayer(socketId);
    expect(playerService.getPlayers()[socketId]).toBeUndefined();
  });
});
