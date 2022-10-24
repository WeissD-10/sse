import { HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { IEnvironment } from 'src/app/interfaces/environment';
import { EnvironmentService } from './environment/environment.service';
import { SseService } from './sse.service';


describe('MemoService', () => {
  let service: SseService;

  const mockEnvironment: IEnvironment = {
    apiHost: 'http://test',
    production: false
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        SseService,
        {provide: HttpClientTestingModule, useValue: { get: (endpoint: any) => of()} },
        { provide: EnvironmentService, useValue: mockEnvironment }
      ]
    });
    service = TestBed.inject(SseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it("should call the HttpClient with the corrent endpoint", () => {
    const getSpy = spyOn(TestBed.inject(HttpClient), "get").and.returnValue(of());
    service.getEvents();
    expect(getSpy).toHaveBeenCalledWith(`${mockEnvironment.apiHost}/events`)
  });
});
