import { Test, TestingModule } from '@nestjs/testing';
import { SseService } from './sse.service.ts';
import { MessageEvent } from '@nestjs/common';

describe('AppController', () => {
  let sseService: SseService;
  const currentDate = new Date().toISOString();
  let events: MessageEvent[];

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [SseService],
    }).compile();
    sseService = app.get<SseService>(SseService);
    events = [...Array(50).keys()].map((value) =>
      sseService.createMockEvent(value),
    );
  });

  describe('root', () => {
    it('should get all memos', () => {
      sseService.eventData = events;
      expect(sseService.getEvents()).toBe(events);
    });
  });
});
