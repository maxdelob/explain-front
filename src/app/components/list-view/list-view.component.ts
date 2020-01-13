import { Component, Input } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { ListElement } from 'src/app/interfaces/list-element';
import { SelectionHandlerService } from '../../providers/selection-handler.service';

@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.scss']
})
export class ListViewComponent {
  checklistSelection = new SelectionModel < ListElement > (true /* multiple */ ); // control the checkboxes
  listElementSelect: ListElement[] = [];
  isEmpty = false;

  @Input('data') data;
  @Input('type') type;

  constructor(private selectionHandlerService: SelectionHandlerService) {}

  todoItemSelectionToggle(val: ListElement) {
    this.addRemoveItemToList(val);
    this.listElementSelect.length > 0 ? this.isEmpty = false : this.isEmpty = true;
    this.selectionHandlerService.setListError(this.listElementSelect.length === 0 ? true : false, this.type);
    this.selectionHandlerService.getListEvent().next([this.listElementSelect, this.type]);  
  }


  addRemoveItemToList(val) {
    if(this.listElementSelect.includes(val) || !val) {
      this.listElementSelect.splice( this.listElementSelect.indexOf(val), 1 );
    } else {
      this.listElementSelect.push(val);
    }
  }


}
