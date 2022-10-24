import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IEnvironment } from '../../interfaces/environment';


@Injectable({
  providedIn: 'root'
})
export class EnvironmentService implements IEnvironment {

  get production() {
    return environment.production;
  }

  get apiHost() {
    return environment.apiHost;
  }
}
