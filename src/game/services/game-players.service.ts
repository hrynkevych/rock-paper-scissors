import { Injectable } from '@nestjs/common';

export interface Player {
  username: string;
  choice: string | null;
  socketId: string;
}

@Injectable()
export class GamePlayersService {
  private players: { [key: string]: Player } = {};

  public registerPlayer(username: string, socketId: string): Player {
    const player = { username, choice: null, socketId };
    this.players[socketId] = player;
    return player;
  }

  public getPlayers(): { [key: string]: Player } {
    return this.players;
  }

  public findOpponent(socketId: string): Player | undefined {
    return Object.values(this.players).find(player => player.socketId !== socketId);
  }

  public removePlayer(socketId: string): void {
    delete this.players[socketId];
  }
}
