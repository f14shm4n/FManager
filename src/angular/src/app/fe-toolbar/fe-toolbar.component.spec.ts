import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeToolbarComponent } from './fe-toolbar.component';

describe('FeToolbarComponent', () => {
  let component: FeToolbarComponent;
  let fixture: ComponentFixture<FeToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
