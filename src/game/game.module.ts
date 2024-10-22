import { Module } from '@nestjs/common';
import { GameService } from './game-logic.service';
import { WebSocketController } from '../web-socket/web-socket.controller';

@Module({
  providers: [GameService, WebSocketController],
})
export class GameModule {}
