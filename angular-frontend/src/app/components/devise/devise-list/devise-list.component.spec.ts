import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviseListComponent } from './devise-list.component';

describe('DeviseListComponent', () => {
  let component: DeviseListComponent;
  let fixture: ComponentFixture<DeviseListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviseListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
