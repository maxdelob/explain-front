import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureButtonComponent } from './configure-button.component';
import { MatButtonModule } from '@angular/material/button';

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
});
