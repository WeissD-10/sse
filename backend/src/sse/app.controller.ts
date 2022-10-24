import { Controller, Get, Logger, MessageEvent, Sse } from '@nestjs/common';
import { Observable } from 'rxjs';
import { SseService } from './SseService';

@Controller('events')
export class EventController {
  private readonly logger = new Logger(EventController.name);
  constructor(private readonly sseService: SseService) {}
  @Get()
  events(): MessageEvent[] {
    this.logger.log('Getting Events');
    return this.sseService.getEvents();
  }

  @Sse('sse')
  sse(): Observable<MessageEvent> {
    this.logger.log('Sending new Event');
    return this.sseService.sendEvents();
  }
}
