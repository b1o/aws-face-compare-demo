import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebcamDialogComponent } from './webcam-dialog.component';

describe('WebcamDialogComponent', () => {
  let component: WebcamDialogComponent;
  let fixture: ComponentFixture<WebcamDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebcamDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WebcamDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
