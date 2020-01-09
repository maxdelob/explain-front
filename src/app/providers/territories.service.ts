import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class TerritoriesService {
  constructor(private http: HttpClient) { }
  serviceBaseUrl = '/territories/';

  initTree(){
    return this.http.get<any[]>(environment.apiBaseUrl + this.serviceBaseUrl + 'initTree');
  }
  getTree(idParent, level){
    return this.http.get<any[]>(environment.apiBaseUrl + this.serviceBaseUrl + 'tree/' + idParent + '?level=' + level);
  }
}

