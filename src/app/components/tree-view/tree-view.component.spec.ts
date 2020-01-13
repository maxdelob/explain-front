import {
  async,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';
import {
  TreeViewComponent
} from './tree-view.component';
import {
  TerritoriesService
} from '../../providers/territories.service';
import {
  SelectionHandlerService
} from '../../providers/selection-handler.service';
import {
  MatTreeModule
} from '@angular/material/tree';
import {
  MatIconModule
} from '@angular/material/icon';
import {
  of as observableOf
} from 'rxjs';
import {
  MatButtonModule
} from '@angular/material/button';
import {
  MatCheckboxModule
} from '@angular/material/checkbox';
import {
  HttpClientTestingModule
} from '@angular/common/http/testing';
import {
  children
} from '../../../assets/mock_child_data_test';
import {
  departements
} from '../../../assets/departements_mock';
import {
  bretagne
} from '../../../assets/bretage_mock';



describe('all functionalities of TreeViewComponent should be working', () => {
  let component: TreeViewComponent;
  let fixture: ComponentFixture < TreeViewComponent > ;
  let serviceTerritoire;
  let serviceSelection;

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
    serviceTerritoire = fixture.debugElement.injector.get(TerritoriesService);
    serviceSelection = fixture.debugElement.injector.get(SelectionHandlerService);


  });

  afterEach(() => {
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('TodoItemSelectionToggle should not load more data if the node level is  is Descendants already in DOM', () => {
    spyOn(component.nestedTreeControl, 'getDescendants').and.returnValue(departements);
    const spy = spyOn(serviceTerritoire, 'getTree').and.returnValue(observableOf(children));
    component.todoItemSelectionToggle(bretagne[0].children[0]);
    expect(spy).not.toHaveBeenCalled();
  });

  it('TodoItemSelectionToggle should load more data if there is not Descendants already in DOM', () => {
    spyOn(component.nestedTreeControl, 'getDescendants').and.returnValue([]);
    const spy = spyOn(serviceTerritoire, 'getTree').and.returnValue(observableOf(children));
    component.todoItemSelectionToggle(bretagne[0].children[0]);
    expect(spy).toHaveBeenCalled();
  });

  it('TodoItemSelectionToggle should not load more data if the node is higher than 3', () => {
    spyOn(component.nestedTreeControl, 'getDescendants').and.returnValue([]);
    const spy = spyOn(serviceTerritoire, 'getTree').and.returnValue(observableOf(children));
    const commune = bretagne[0].children[0].children[0].children[0].children[0];
    component.todoItemSelectionToggle(commune);
    expect(spy).not.toHaveBeenCalled();
  });

  it('TodoItemSelectionToggle (with data to load) should call datachange next to update the tree', () => {
    const datachangeMock = spyOn(component.datachange, 'next');
    spyOn(component.nestedTreeControl, 'getDescendants').and.returnValue(departements);
    spyOn(serviceTerritoire, 'getTree').and.returnValue(observableOf(children));
    component.todoItemSelectionToggle(bretagne[0]);
    expect(datachangeMock).toHaveBeenCalled();
  });

  it('TodoItemSelectionToggle (with no data to load) should call datachange next to updarte the tree', () => {
    const datachangeMock = spyOn(component.datachange, 'next');
    spyOn(component.nestedTreeControl, 'getDescendants').and.returnValue([]);
    spyOn(serviceTerritoire, 'getTree').and.returnValue(observableOf(children));
    component.todoItemSelectionToggle(bretagne[0]);
    expect(datachangeMock).toHaveBeenCalled();
  });


  it('handleSelection should call removeParent', () => {
    const spyRemove = spyOn(component, 'removeParent');
    const spySelection = spyOn(serviceSelection, 'getTreeEvent').and.callThrough();
    component.handleSelection(bretagne[0].children); // is toggled : false;
    expect(spyRemove).toHaveBeenCalled();
    expect(spySelection).toHaveBeenCalled();
  });


  it('removeParent should remove the parent of the selection', () => {
    const epcis = bretagne[0].children[0].children[0].children;
    const communes = bretagne[0].children[0].children[0].children;
    const spy = spyOn(component, 'getParentNode').and.returnValue(epcis[0]);
    component.removeParent(communes);
    expect(spy).toHaveBeenCalled();
  });

  it('unSelectAllBoxes should toggle all isToggled to false', () => {
    component.nodesSelected = bretagne;
    const commune = bretagne[0].children[0].children[0].children[0].children[0]; // is toggled set to true
    component.unSelectAllBoxes();
    expect(commune.isToggled).not.toBeTruthy();
  });

  it('unSelectAllBoxes should call initCheckboxes', () => {
    component.nodesSelected = bretagne;
    const spyInit = spyOn(component, 'initCheckboxes');
    component.unSelectAllBoxes();
    expect(spyInit).toHaveBeenCalled();
  });

  it('unSelectAllBoxes should call checklistSelection', () => {
    component.nodesSelected = bretagne;
    const spyDeselect = spyOn(component.checklistSelection, 'deselect');
    component.unSelectAllBoxes();
    expect(spyDeselect).toHaveBeenCalled();
  });

  it('unSelectAllBoxes should empty selection', () => {
    component.nodesSelected = bretagne;
    const spyNext = spyOn(component.selectionchange, 'next');
    component.unSelectAllBoxes();
    expect(spyNext).toHaveBeenCalled();
    expect(component.isEmpty).toEqual(true);
  });

  it('getParentNode with paus data should return null', () => {
    component.nodesSelected = bretagne;
    const test = component.getParentNode(bretagne[0]);
    expect(test).toEqual(null);
  });
  it('getParentNode with region data should return the correct pays', () => {
    component.nodesSelected = bretagne;
    const region = bretagne[0].children[0];
    const pays =  bretagne[0];
    const test = component.getParentNode(region);
    expect(test).toEqual(pays);
  });

  it('getParentNode with deparement data should return the correct region', () => {
    component.nodesSelected = bretagne;
    const dep = bretagne[0].children[0].children[0];
    const region =  bretagne[0].children[0];
    const test = component.getParentNode(dep);
    expect(test).toEqual(region);
  });

  it('getParentNode with EPCI data should return the correct departement', () => {
    component.nodesSelected = bretagne;
    const epci = bretagne[0].children[0].children[0].children[0];
    const dep =  bretagne[0].children[0].children[0];
    const test = component.getParentNode(epci);
    expect(test).toEqual(dep);
  });

  it('getParentNode with commune data should return the correct EPCI', () => {
    component.nodesSelected = bretagne;
    const commune = bretagne[0].children[0].children[0].children[0].children[0];
    const epci =  bretagne[0].children[0].children[0].children[0];
    const test = component.getParentNode(commune);
    expect(test).toEqual(epci);
  });

  it('loadMoreChildren should call addChildrenToParent and call datachange next', () => {
    spyOn(serviceTerritoire, 'getTree').and.returnValue(observableOf(children));
    const spyOnaddChildrenToParent = spyOn(component, 'addChildrenToParent').and.returnValue(bretagne[0].children);
    const spyOnnext = spyOn(component.datachange, 'next');
    component.loadMoreChildren(bretagne);
    expect(spyOnaddChildrenToParent).toHaveBeenCalled();
    expect(spyOnnext).toHaveBeenCalled();
  });

});
