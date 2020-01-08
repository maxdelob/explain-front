import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ListElement } from '../interfaces/list-element';
import { Territoire } from '../interfaces/territoire';

@Injectable({
  providedIn: 'root'
})
export class SelectionHandlerService {
  TYPE_THEME = 'Themes';
  TYPE_SOURCE = 'Sources';
  public projectEventHandler: BehaviorSubject <string> = new BehaviorSubject('');
  public listEventHandler: BehaviorSubject <[ListElement[], string]> = new BehaviorSubject([[], '']);
  public treeEventHandler: BehaviorSubject <Territoire[]> = new BehaviorSubject([]);
  private errorProjectName = false;
  private themeError = false;
  private sourceError = false;
  private treeError = false;
  constructor() { }

  // Input project name
  getProjectEvent() { return this.projectEventHandler; }
  setProjectNameError(val) {  this.errorProjectName = val; }
  getProjectNameError() {   return this.errorProjectName; }

  // List
  getListEvent() { return this.listEventHandler; }
  setListError(err, type) { type === this.TYPE_SOURCE ? this.sourceError = err : this.themeError = err; }
  getThemeError() { return this.themeError; }
  getSourceError() { return this.sourceError; }

  // Three view
  getTreeEvent() { return this.treeEventHandler; }
  getTreeError() { return this.treeError; }
  setTreeError(val) { this.treeError = val; }
}
