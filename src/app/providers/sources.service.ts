import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ListElement } from '../interfaces/list-element';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SourcesService {
  constructor(private http: HttpClient) { }
  serviceBaseUrl = '/sources/';

  get() {
    return this.http.get<ListElement[]>(environment.apiBaseUrl + this.serviceBaseUrl);
  }
}
