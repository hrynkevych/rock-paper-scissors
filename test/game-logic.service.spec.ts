import { GameService } from '../src/game/game-logic.service';

describe('GameService', () => {
  let gameService: GameService;

  beforeEach(() => {
    gameService = new GameService();
  });

  it('should register a new player', () => {
    const username = 'Player1';
    const socketId = 'socket1';
    const result = gameService.registerPlayer(username, socketId);

    expect(result).toBe(`Player ${username} has joined the game.`);
    expect(gameService.getPlayers()[socketId].username).toBe(username);
  });

  it('should set a player action and notify when both players have made choices', () => {
    const socketId1 = 'socket1';
    const socketId2 = 'socket2';

    gameService.registerPlayer('Player1', socketId1);
    gameService.registerPlayer('Player2', socketId2);

    let result = gameService.setPlayerAction(socketId1, 'rock');
    expect(result).toBe('You chose rock. Opponent will be notified.');

    result = gameService.setPlayerAction(socketId2, 'scissors');
    expect(result).toBe('Both players have made their choices. Player1 wins!');
  });

  it('should declare a draw if both players choose the same element', () => {
    const socketId1 = 'socket1';
    const socketId2 = 'socket2';

    gameService.registerPlayer('Player1', socketId1);
    gameService.registerPlayer('Player2', socketId2);

    gameService.setPlayerAction(socketId1, 'rock');
    const result = gameService.setPlayerAction(socketId2, 'rock');

    expect(result).toBe('Both players have made their choices. It’s a draw!');
  });

  it('should reset choices after a round is completed', () => {
    const socketId1 = 'socket1';
    const socketId2 = 'socket2';

    gameService.registerPlayer('Player1', socketId1);
    gameService.registerPlayer('Player2', socketId2);

    gameService.setPlayerAction(socketId1, 'rock');
    gameService.setPlayerAction(socketId2, 'scissors');

    gameService.resetChoices();

    expect(gameService.getPlayers()[socketId1].choice).toBeNull();
    expect(gameService.getPlayers()[socketId2].choice).toBeNull();
  });

  it('should remove a player from the game', () => {
    const socketId = 'socket1';
    gameService.registerPlayer('Player1', socketId);

    expect(gameService.getPlayers()[socketId]).toBeDefined();

    gameService.removePlayer(socketId);
    expect(gameService.getPlayers()[socketId]).toBeUndefined();
  });
});
