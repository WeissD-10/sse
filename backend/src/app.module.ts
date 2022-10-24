import { Module } from '@nestjs/common';
import { EventController } from './sse/app.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { SseService } from './sse/SseService';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [EventController],
  providers: [SseService],
})
export class AppModule {}
