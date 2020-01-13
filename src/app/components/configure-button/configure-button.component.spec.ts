import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureButtonComponent } from './configure-button.component';
import { MatButtonModule } from '@angular/material/button';
import { ListElement } from 'src/app/interfaces/list-element';
import { Territoire } from 'src/app/interfaces/territoire';

describe('ConfigureButtonComponent', () => {
  let component: ConfigureButtonComponent;
  let fixture: ComponentFixture<ConfigureButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigureButtonComponent ],
      imports: [MatButtonModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigureButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('isButtonDisabled should activate the button if there is no error', () => {
    component.isSourceError = false;
    component.isThemeError = false;
    component.isProjectNameError = false;
    component.isTreeError = false;
    component.isButtonDisabled();
    expect(component.disableButton).toBeFalsy();
  });

  it('isButtonDisabled should disable the button if there is at least one error', () => {
    component.isSourceError = false;
    component.isThemeError = false;
    component.isProjectNameError = true;
    component.isTreeError = false;
    component.isButtonDisabled();
    expect(component.disableButton).toBeTruthy();
  });

  it('export should call exportDocument', () => {
    const spy = spyOn(component, 'exportDocument');
    component.export();
    expect(spy).toHaveBeenCalled();
  });

  it('exportDocument should create a hidden html element', () => {
    const spy = spyOn(document,  'createElement').and.callThrough();
    component.exportDocument('test');
    expect(spy).toHaveBeenCalled();
  });

  it('export should call exportDocument with an object correctly mapped', () => {
    const spy = spyOn(component, 'exportDocument');
    const test: ListElement = {id : 'test', name : 'test'};
    component.projectName = 'test';
    component.listSourceSelected = [test];
    component.listThemeSelected = [test];
    const fakeCommun: Territoire = {
      id: '0001',
      name: "villepreux",
      level: 3,
      children: [],
      isToggled: true,
      isExpended: false,
      pcode: "FREPCI200067460",
      idLevel0: '43918',
      idLevel1: '43919',
      idLevel2: '43920'
      };

    component.listTerritories = [fakeCommun];
    const expectedValue =  JSON.stringify({
      project_code : 'test',
      territories : ['FREPCI200067460'],
      themes : ['test'],
      sources : ['test']
    });
    component.export();
    expect(spy).toHaveBeenCalledWith(expectedValue);
  });


});
