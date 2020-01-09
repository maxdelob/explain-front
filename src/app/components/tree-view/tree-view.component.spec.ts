import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TreeViewComponent} from './tree-view.component';
import { TerritoriesService} from '../../providers/territories.service';
import { SelectionHandlerService } from '../../providers/selection-handler.service';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { of as observableOf } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { children } from '../../../assets/mock_child_data_test';
import { departements } from '../../../assets/departements_mock';
import {  bretagne } from '../../../assets/bretage_mock';

describe('TreeViewComponent', () => {
  let component: TreeViewComponent;
  let fixture: ComponentFixture < TreeViewComponent > ;
  beforeEach(async (() => {
    TestBed.configureTestingModule({
        declarations: [TreeViewComponent],
        providers: [TerritoriesService, SelectionHandlerService],
        imports: [MatTreeModule, MatIconModule, MatButtonModule, MatCheckboxModule, HttpClientTestingModule]
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  afterEach(()=> {
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('TodoItemSelectionToggle should not load more data if there is Descendants already in DOM', ()=> {
    spyOn(component.nestedTreeControl, 'getDescendants').and.returnValue(departements);
    const service = fixture.debugElement.injector.get(TerritoriesService);
    const spy = spyOn(service, 'getTree').and.returnValue(observableOf(children));
    component.todoItemSelectionToggle(bretagne[0].children[0]);
    expect(spy).not.toHaveBeenCalled();
  });

  it('TodoItemSelectionToggle should load more data if there is not Descendants already in DOM', ()=> {
    spyOn(component.nestedTreeControl, 'getDescendants').and.returnValue([]);
    const service = fixture.debugElement.injector.get(TerritoriesService);
    const spy = spyOn(service, 'getTree').and.returnValue(observableOf(children));
    component.todoItemSelectionToggle(bretagne[0].children[0]);
    expect(spy).toHaveBeenCalled();
  });

  it('Handle selection is called why value change is emit', () => {
    const spy = spyOn(component, 'handleSelection');
    component.selectionchange.next(bretagne);
    expect(spy).toHaveBeenCalled();
  });

});