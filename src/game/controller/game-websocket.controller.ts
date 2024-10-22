import { Injectable, OnModuleInit } from '@nestjs/common';
import { Server } from 'ws';
import { GameLogicService } from '../services/game-logic.service';
import { GamePlayersService } from '../services/game-players.service';
import { assignId, sendMessage, sendMessageToSocket, broadcast } from '../utils/utils';

@Injectable()
export class GameWebSocketController implements OnModuleInit {
  private wss: Server;

  constructor(
    private readonly playerService: GamePlayersService,
    private readonly gameLogicService: GameLogicService
  ) {}

  onModuleInit() {
    this.wss = new Server({ port: 3005 });

    this.wss.on('connection', (ws) => {
      const id = assignId(ws);

      ws.on('message', (message: string) => {
        const parsedMessage = JSON.parse(message);
        switch (parsedMessage.event) {
          case 'joinGame':
            this.handleJoinGame(ws, parsedMessage, id);
            break;
          case 'playerChoice':
            this.handlePlayerChoice(ws, parsedMessage, id);
            break;
        }
      });

      ws.on('close', () => {
        this.playerService.removePlayer(id);
        broadcast(this.wss, 'status', {
          message: 'Player has left the game.',
          players: this.playerService.getPlayers(),
        });
      });
    });
  }

  private handleJoinGame(ws, message, id) {
    const player = this.playerService.registerPlayer(message.data.username, id);
    sendMessage(ws, 'status', { message: `Welcome, ${player.username}`, playerId: id, players: this.playerService.getPlayers() });
    broadcast(this.wss, 'status', { message: `${player.username} has joined the game.`, players: this.playerService.getPlayers() });
  }

  private handlePlayerChoice(ws, message, id) {
    const player = this.playerService.getPlayers()[id];
    player.choice = message.data.choice;
  
    const opponent = this.playerService.findOpponent(id);
  
    if (!opponent) {
      sendMessage(ws, 'status', {
        message: `You chose ${player.choice}. Waiting for an opponent.`,
        players: this.playerService.getPlayers(),
      });
      return;
    }
  
    sendMessageToSocket(this.wss, opponent.socketId, 'status', {
      message: 'Your opponent has made a choice!',
      players: this.playerService.getPlayers(),
    });
  
    if (player.choice && opponent.choice) {
      const result = this.gameLogicService.decideWinner(player.choice, opponent.choice);
  
      sendMessage(ws, 'gameResult', { message: result.playerMessage, players: this.playerService.getPlayers() });
      sendMessageToSocket(this.wss, opponent.socketId, 'gameResult', { message: result.opponentMessage, players: this.playerService.getPlayers() });
  
      this.gameLogicService.resetChoices(this.playerService.getPlayers());
    }
  }
}
