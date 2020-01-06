import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Administrative } from '../interfaces/administrative';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class TerritoriesService {
  constructor(private http: HttpClient) { }
  hashMatrixAdm = new Map<number, Map<string, string>>(); // key level value hashmap of admin level
  hashDepartement = new Map<string, string>(); // key name value id (retrieve and id from a name)
  hashEpci = new Map<string, string>(); // key name value id (retrieve and id from a name)
  hashCommune = new Map<string, string>(); // key name value id (retrieve and id from a name) 
  serviceBaseUrl = '/territories/';

  getDepartements() {
    return this.http.get<Administrative[]>(environment.apiBaseUrl + this.serviceBaseUrl + 'departements');
  }

  setDepartementHashMap(departements: Administrative[]) {
    departements.forEach(elm => this.hashDepartement.set(elm.name, elm.id));
    this.hashMatrixAdm.set(0, this.hashDepartement);
  }

  getEpci() {
    return this.http.get<Administrative[]>(environment.apiBaseUrl + this.serviceBaseUrl + 'epcis');
  }
  setEpciHashMap(epci: Administrative[]) {
    epci.forEach(elm => this.hashEpci.set(elm.name, elm.id));
    this.hashMatrixAdm.set(1, this.hashEpci);
  }


  findByName(body){
    return this.http.post(environment.apiBaseUrl + this.serviceBaseUrl + 'findByName', body);
  }
  
  getMatrixAdm(level) {
    return this.hashMatrixAdm.get(level);
  }


  getTreeData(){
    return this.http.get<any[]>(environment.apiBaseUrl +  this.serviceBaseUrl + 'getTreeData');
  }

  // getCommunesByDepartements(name){
  //   return this.http.get<any[]>(environment.apiBaseUrl + this.serviceBaseUrl + 'getCommunesByDepartements/' + name);
  // }

  initTree(){
    return this.http.get<any[]>(environment.apiBaseUrl + this.serviceBaseUrl + 'initTree');    
  }
  getTree(idParent, level){
    return this.http.get<any[]>(environment.apiBaseUrl + this.serviceBaseUrl + 'tree/' + idParent + '?level=' + level);
  }

  getRegion(){
    return this.http.get<any[]>(environment.apiBaseUrl + this.serviceBaseUrl + 'regions');
  }  
}

