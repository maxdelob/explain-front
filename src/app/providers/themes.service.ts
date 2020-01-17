import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';


export class Theme {
  id: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class ThemesService {
  constructor(private http: HttpClient) {}
  serviceBaseUrl = '/themes/';

  get() {
    return this.http.get<Theme[]>(environment.apiBaseUrl + this.serviceBaseUrl);
  }
}

