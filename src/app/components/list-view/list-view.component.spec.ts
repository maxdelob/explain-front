import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListViewComponent } from './list-view.component';
import { MaterialModule } from 'dist/eXplain-front/assets/angular-material.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ListElement } from 'src/app/interfaces/list-element';

describe('ListViewComponent', () => {
  let component: ListViewComponent;
  let fixture: ComponentFixture<ListViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListViewComponent ],
      imports: [MaterialModule, HttpClientTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('todoItemSelectionToggle (with no list item) should set error to true and call addRemoveItemToList', () => {
    const test: ListElement = {id : 'test', name : 'test'};
    const spy = spyOn(component, 'addRemoveItemToList');
    component.todoItemSelectionToggle(test);
    expect(component.isEmpty).toBeTruthy();
    expect(spy).toHaveBeenCalled();
  });
  it('todoItemSelectionToggle (with list item) should not set the error', () => {
    const test: ListElement = {id : 'test', name : 'test'};
    component.listElementSelect = [test, test];
    component.todoItemSelectionToggle(test);
    expect(component.isEmpty).toBeFalsy();
  });
  it('addRemoveItemToList should add new data to the list', () => {
    const spy = spyOn(component.listElementSelect, 'push');
    component.addRemoveItemToList('val');
    expect(spy).toHaveBeenCalled();
  });

  it('addRemoveItemToList should remove exiting data to the list', () => {
    const test: ListElement = {id : 'test', name : 'test'};
    component.listElementSelect = [test, test];
    component.addRemoveItemToList(test);
    expect(component.listElementSelect.length).toEqual(1);
  });

});
