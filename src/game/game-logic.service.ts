import { Injectable } from '@nestjs/common';

interface Player {
  username: string;
  choice: string | null;
  socketId: string;
}

@Injectable()
export class GameService {
  private players: { [key: string]: Player } = {};

  public getPlayers(): { [key: string]: Player } {
    return this.players;
  }

  public findOpponent(socketId: string): Player | undefined {
    return Object.values(this.players).find((player) => player.socketId !== socketId);
  }

  registerPlayer(username: string, socketId: string): string {
    this.players[socketId] = { username, choice: null, socketId };
    return `Player ${username} has joined the game.`;
  }

  setPlayerAction(socketId: string, choice: string): string {
    const player = this.players[socketId];
    if (!player) {
      return `Player not found with socket ID ${socketId}`;
    }

    player.choice = choice;
    const opponent = this.findOpponent(socketId);

    if (opponent) {
      if (opponent.choice !== null) {
        const result = this.decideWinner(socketId, player.choice, opponent.socketId, opponent.choice);
        return `Both players have made their choices. ${result}`;
      } else {
        return `You chose ${choice}. Opponent will be notified.`;
      }
    } else {
      return `You chose ${choice}. Waiting for an opponent.`;
    }
  }

  decideWinner(playerSocketId: string, playerChoice: string, opponentSocketId: string, opponentChoice: string): string {
    const winningCombinations: { [key: string]: string } = {
      rock: 'scissors',
      paper: 'rock',
      scissors: 'paper',
    };

    if (playerChoice === opponentChoice) {
      return "It’s a draw!";
    }

    if (winningCombinations[playerChoice] === opponentChoice) {
      return this.players[playerSocketId].username + ' wins!';
    } else {
      return this.players[opponentSocketId].username + ' wins!';
    }
  }

  resetChoices(): void {
    Object.values(this.players).forEach((player) => {
      player.choice = null;
    });
  }

  removePlayer(socketId: string): Player | undefined {
    const player = this.players[socketId];
    if (player) {
      delete this.players[socketId];
    }
    return player;
  }
}
