import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ConfirmationDialogComponent', () => {
  let component: ConfirmationDialogComponent;
  let fixture: ComponentFixture<ConfirmationDialogComponent>;
  let dialogRef: MatDialogRef<ConfirmationDialogComponent>;

  const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmationDialogComponent],
      imports: [MatDialogModule,HttpClientTestingModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { message: 'Test Message' } },
        { provide: MatDialogRef, useValue: dialogRefSpy }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationDialogComponent);
    component = fixture.componentInstance;
    dialogRef = TestBed.inject(MatDialogRef);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close dialog with false when onNoClick is called', () => {
    component.onNoClick();
    expect(dialogRef.close).toHaveBeenCalledWith(false);
  });

  it('should close dialog with true when onYesClick is called', () => {
    component.onYesClick();
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });
});
