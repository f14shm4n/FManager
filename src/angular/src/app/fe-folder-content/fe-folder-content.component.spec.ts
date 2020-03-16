import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeFolderContentComponent } from './fe-folder-content.component';

describe('FeFolderContentComponent', () => {
  let component: FeFolderContentComponent;
  let fixture: ComponentFixture<FeFolderContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeFolderContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeFolderContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
