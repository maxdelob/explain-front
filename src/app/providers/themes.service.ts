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
  constructor(private http: HttpClient) { }
  hashMatrixAdm = new Map<number, Map<string, string>>(); // key level value hashmap of admin level
  hashDepartement = new Map<string, string>(); // key name value id (retrieve and id from a name)
  hashEpci = new Map<string, string>(); // key name value id (retrieve and id from a name)
  hashCommune = new Map<string, string>(); // key name value id (retrieve and id from a name) 
  serviceBaseUrl = '/themes/';

  get() {
    return this.http.get<Theme[]>(environment.apiBaseUrl + this.serviceBaseUrl);
  }
}

