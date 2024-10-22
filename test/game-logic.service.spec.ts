import { GameLogicService } from '../src/game/services/game-logic.service';

describe('GameLogicService', () => {
  let gameLogicService: GameLogicService;

  beforeEach(() => {
    gameLogicService = new GameLogicService();
  });

  it('should declare a winner based on player choices', () => {
    const result = gameLogicService.decideWinner('rock', 'scissors');
    expect(result).toEqual({
      playerMessage: 'You win!',
      opponentMessage: 'You lose!',
    });
  });

  it('should declare a draw if both players choose the same element', () => {
    const result = gameLogicService.decideWinner('rock', 'rock');
    expect(result).toEqual({
      playerMessage: "It’s a draw!",
      opponentMessage: "It’s a draw!",
    });
  });

  it('should reset player choices', () => {
    const players = {
      player1: { username: 'Player1', choice: 'rock', socketId: 'socket1' },
      player2: { username: 'Player2', choice: 'scissors', socketId: 'socket2' },
    };

    gameLogicService.resetChoices(players);

    expect(players.player1.choice).toBeNull();
    expect(players.player2.choice).toBeNull();
  });
});
