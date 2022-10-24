import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';

import { EnvironmentService } from './environment.service';

describe('EnvironmentService', () => {
  let service: EnvironmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnvironmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should receive the correct environment',() => {
    expect(service.apiHost).toBe(environment.apiHost);
    expect(service.production).toBe(environment.production);
  })

});
