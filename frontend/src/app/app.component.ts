import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { IEvent } from './interfaces/events';
import { SseService } from './services/sse.service';




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent implements OnInit {
  displayedColumns: string[] = ['timeStamp', 'msg'];



  events: IEvent[] = [{eventMsg: 'test', timeStamp: new Date().toISOString()}];

  constructor(private zone: NgZone, private sseService: SseService) {}

  @ViewChild(MatTable)
  table!: MatTable<IEvent>;

  ngOnInit(){
    this.sseService.getEvents().pipe(first()).subscribe(events =>
      {
        this.events = events;
        this.table.renderRows();
      }
      );
    let eventStream$: Observable<IEvent>;
    eventStream$ = this.sseService.getEventStream();
    eventStream$.subscribe({
      next: (data: any) => {
        this.zone.run(() => {
          this.events.push(data);
          this.table.renderRows();
        });

      },
      error: err => console.error('something wrong occurred: ' + err)
    });
  }
  convertEventsForChart(data: MessageEvent[]) {

  }
}
