import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TaskFormComponent } from './task-form.component';
import { TaskService } from '../../service/task.service';
import { of } from 'rxjs';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TaskFormComponent', () => {
  let component: TaskFormComponent;
  let fixture: ComponentFixture<TaskFormComponent>;
  let dialogRef: MatDialogRef<TaskFormComponent>;
  let taskService: TaskService;

  const mockDialogRef = {
    close: jasmine.createSpy('close')
  };



  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TaskFormComponent, ConfirmationDialogComponent],
      imports: [
        HttpClientTestingModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule, MatDatepickerModule, 
        MatNativeDateModule,MatSelectModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: TaskService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskFormComponent);
    component = fixture.componentInstance;
    dialogRef = TestBed.inject(MatDialogRef);
    taskService = TestBed.inject(TaskService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with data if provided', () => {
    const mockData = {
      assignedTo: 'User 1',
      description: 'Task description',
      status: 'In Progress',
      dueDate: new Date(),
      priority: 'High'
    };

    component.data = mockData;
    component.ngOnInit();

    expect(component.taskForm.value.assignedTo).toBe(mockData.assignedTo);
    expect(component.taskForm.value.description).toBe(mockData.description);
    expect(component.taskForm.value.status).toBe(mockData.status);
    expect(component.taskForm.value.dueDate).toEqual(mockData.dueDate);
    expect(component.taskForm.value.priority).toBe(mockData.priority);
  });

  it('should call taskService.updateTask and close dialog on form submission', () => {
    spyOn(taskService, 'updateTask').and.returnValue(of({}));

    const mockData = {
      _id: 'task_id',
      assignedTo: 'User 1',
      description: 'Task description',
      status: 'In Progress',
      dueDate: new Date(),
      priority: 'High'
    };

    component.data = mockData;
    component.ngOnInit();
    component.onSubmit();

    expect(taskService.updateTask).toHaveBeenCalledWith(mockData._id, component.taskForm.value);
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should call taskService.createTask and close dialog on form submission', () => {
    spyOn(taskService, 'createTask').and.returnValue(of({}));

    const mockFormValue = {
      assignedTo: 'User 1',
      description: 'Task description',
      status: 'In Progress',
      dueDate: new Date(),
      priority: 'High'
    };
    component.data = null;
    component.taskForm.setValue(mockFormValue);
    component.onSubmit();

    expect(taskService.createTask).toHaveBeenCalledWith(mockFormValue);
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should close dialog on cancellation', () => {
    component.onCancel();
    expect(dialogRef.close).toHaveBeenCalled();
  });
});
