import { Module } from '@nestjs/common';
import { GameLogicService } from './services/game-logic.service';
import { GamePlayersService } from './services/game-players.service';
import { GameWebSocketController } from './controller/game-websocket.controller';

@Module({
  providers: [ GameLogicService, GamePlayersService, GameWebSocketController],
})
export class GameModule {}
