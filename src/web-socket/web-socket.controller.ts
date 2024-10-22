import { Injectable, OnModuleInit } from '@nestjs/common';
import { Server } from 'ws';
import { GameService } from '../game/game-logic.service';
import { assignId, sendMessage, sendMessageToSocket, broadcast } from './web-socket.utils';

@Injectable()
export class WebSocketController implements OnModuleInit {
  private wss: Server;

  constructor(private readonly gameService: GameService) {}

  onModuleInit() {
    this.wss = new Server({ port: 3005 });

    this.wss.on('connection', (ws) => {
      const id = assignId(ws);

      ws.on('message', (message: string) => {
        const parsedMessage = JSON.parse(message);

        if (parsedMessage.event === 'joinGame') {
          this.handleJoinGame(ws, parsedMessage, id);
        }

        if (parsedMessage.event === 'playerChoice') {
          this.handlePlayerChoice(ws, parsedMessage, id);
        }
      });

      ws.on('close', () => {
        this.gameService.removePlayer(id);
        broadcast(this.wss, 'status', {
          message: `Player has left the game.`,
          players: this.gameService.getPlayers(),
        });
      });
    });
  }

  public handleJoinGame(ws, message, id) {
    this.gameService.registerPlayer(message.data.username, id);
    sendMessage(ws, 'status', {
      message: `Welcome, ${message.data.username}`,
      playerId: id,
      players: this.gameService.getPlayers(),
    });
    broadcast(this.wss, 'status', {
      message: `${message.data.username} has joined the game.`,
      players: this.gameService.getPlayers(),
    });
  }

  public handlePlayerChoice(ws, message, id) {
    const choice = message.data.choice;
    const status = this.gameService.setPlayerAction(id, choice);
    sendMessage(ws, 'status', { message: status, choice, players: this.gameService.getPlayers() });

    const opponent = this.gameService.findOpponent(id);
    if (opponent) {
      sendMessageToSocket(this.wss, opponent.socketId, 'status', {
        message: 'Your opponent has made a choice!',
        players: this.gameService.getPlayers(),
      });
    }

    const players = Object.values(this.gameService.getPlayers());
    const bothPlayersMadeChoice = players.every((player) => player.choice !== null);

    if (bothPlayersMadeChoice && players.length === 2) {
      const [player, opponent] = players;
      if (player && opponent) {
        const result = this.gameService.decideWinner(player.socketId, player.choice!, opponent.socketId, opponent.choice!);
        broadcast(this.wss, 'gameResult', { result, players: this.gameService.getPlayers() });
        this.gameService.resetChoices();
      }
    }
  }
}
