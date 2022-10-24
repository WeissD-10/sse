import {
  Injectable,
  MessageEvent,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { interval, map, Observable, Subject, takeUntil } from 'rxjs';

@Injectable()
export class SseService implements OnModuleInit, OnModuleDestroy {
  eventData = new Array<MessageEvent>();
  eventData$ = new Observable<MessageEvent>();
  destroy$ = new Subject<void>();
  maxRandom = 1000000;

  onModuleInit() {
    this.eventData = [...Array(200).keys()].map((value) =>
      this.createMockEvent(value),
    );
    this.eventData$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.eventData.push(data);
    });
  }
  onModuleDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  sendEvents(): Observable<MessageEvent> {
    return interval(1000).pipe(
      map(
        (_) =>
          ({
            data: {
              timeStamp: new Date().toISOString(),
              eventMsg: `${this.getRandomInt(this.maxRandom)}`,
            },
          } as MessageEvent),
      ),
    );
  }
  createMockEvent(val: number): MessageEvent {
    return {
      data: {
        timeStamp: new Date(val * 1000 - Date.now()).toISOString(),
        eventMsg: `${this.getRandomInt(this.maxRandom)}`,
      },
    };
  }
  getEvents(): MessageEvent[] {
    return this.eventData;
  }
  getRandomInt(val: number): number {
    return Math.floor(Math.random() * val);
  }
}
