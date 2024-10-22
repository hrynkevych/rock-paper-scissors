import { Injectable } from '@nestjs/common';
import { Player } from './game-players.service';

@Injectable()
export class GameLogicService {
  private readonly winningCombinations: { [key: string]: string } = {
    rock: 'scissors',
    paper: 'rock',
    scissors: 'paper',
  };

  public decideWinner(playerChoice: string, opponentChoice: string): { playerMessage: string, opponentMessage: string } {
    if (playerChoice === opponentChoice) {
      return { playerMessage: "It’s a draw!", opponentMessage: "It’s a draw!" };
    }
  
    const winningCombinations: { [key: string]: string } = {
      rock: 'scissors',
      paper: 'rock',
      scissors: 'paper',
    };
  
    if (winningCombinations[playerChoice] === opponentChoice) {
      return { playerMessage: 'You win!', opponentMessage: 'You lose!' };
    } else {
      return { playerMessage: 'You lose!', opponentMessage: 'You win!' };
    }
  }

  public resetChoices(players: { [key: string]: Player }): void {
    Object.values(players).forEach((player) => {
      player.choice = null;
    });
  }
}
