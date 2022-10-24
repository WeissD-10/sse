import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import {catchError, map, retry} from 'rxjs/operators';
import { IEvent, RawEvent } from '../interfaces/events';

import { EnvironmentService } from './environment/environment.service';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class SseService {

  private retrys = 3;

  constructor(private http: HttpClient, private env: EnvironmentService) {}

  getEventStream(): Observable<IEvent> {
    return new Observable<IEvent>((observer) => {
      let eventSource = new EventSource(`${this.env.apiHost}/events/sse`);
      eventSource.onmessage = (event) => {
        console.debug('Received event: ', event);
        let json = JSON.parse(event.data);
        observer.next({timeStamp: json['timeStamp'], eventMsg: json['eventMsg']});
      };
      eventSource.onerror = (error) => {
        // readyState === 0 (closed) means the remote source closed the connection,
        // so we can safely treat it as a normal situation. Another way
        // of detecting the end of the stream is to insert a special element
        // in the stream of events, which the client can identify as the last one.
        if(eventSource.readyState === 0) {
          console.log('The stream has been closed by the server.');
          eventSource.close();
          observer.complete();
        } else {
          observer.error('EventSource error: ' + error);
        }
      }
    });
  }

  getEvents(): Observable<IEvent[]> {
    return this.http.get<RawEvent[]>(`${this.env.apiHost}/events`).pipe(this.commonOperators(), map((event:RawEvent[]) => {
      const result = new Array<IEvent>();
      event.forEach(e => result.push({timeStamp: e.data.timeStamp, eventMsg: e.data.eventMsg}));
      return result;
    }));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    return throwError(`Error: ${error.statusText}, please try again later`);
  }
  //TODO: Research ways to get rid of any
  /**
   * collection of rxjs operators usefull once we have a few more endpoints
   * @returns rxjs operators in common inside this service
   */
  private commonOperators(): any {
    return retry(this.retrys), catchError((error) => this.handleError(error))
  }
}
