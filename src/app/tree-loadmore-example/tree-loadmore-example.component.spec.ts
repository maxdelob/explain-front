import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeLoadmoreExampleComponent } from './tree-loadmore-example.component';

describe('TreeLoadmoreExampleComponent', () => {
  let component: TreeLoadmoreExampleComponent;
  let fixture: ComponentFixture<TreeLoadmoreExampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreeLoadmoreExampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeLoadmoreExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
