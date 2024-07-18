import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { TaskListComponent } from './task-list.component';
import { TaskFormComponent } from '../task-form/task-form.component';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { TaskService } from '../../service/task.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let taskService: TaskService;
  let dialog: MatDialog;

  const mockTasks = [
    { _id: 1, assignedTo: 'John Doe', status: 'Pending', dueDate: new Date(), priority: 'High', description: 'Task 1' },
    { _id: 2, assignedTo: 'Jane Doe', status: 'Completed', dueDate: new Date(), priority: 'Medium', description: 'Task 2' }
  ];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TaskListComponent, TaskFormComponent, ConfirmationDialogComponent],
      imports: [
        HttpClientTestingModule,
        MatDialogModule,
        MatTableModule,
        MatPaginatorModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,MatDatepickerModule,
        FormsModule,    MatNativeDateModule,
        MatToolbarModule, MatInputModule, MatIconModule, MatCheckboxModule, MatMenuModule
      ],
      providers: [TaskService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    taskService = TestBed.inject(TaskService);
    dialog = TestBed.inject(MatDialog);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch tasks on initialization', () => {
    spyOn(taskService, 'getTasks').and.returnValue(of(mockTasks));
    component.ngOnInit();
    expect(taskService.getTasks).toHaveBeenCalled();
    expect(component.dataSource.data).toEqual(mockTasks);
  });

  it('should open task form dialog', () => {
    const dialogSpy = spyOn(dialog, 'open').and.callThrough();
    component.openTaskForm();
    expect(dialogSpy).toHaveBeenCalledWith(TaskFormComponent, { width: '90%' });
  });

  it('should open task edit dialog', () => {
    const dialogSpy = spyOn(dialog, 'open').and.callThrough();
    const task = mockTasks[0];
    component.editTask(task);
    expect(dialogSpy).toHaveBeenCalledWith(TaskFormComponent, { width: '90%', data: task });
  });

  it('should open confirmation dialog and delete task', () => {
    const dialogSpy = spyOn(dialog, 'open').and.returnValue({
      afterClosed: () => of(true)
    } as any);
    const deleteSpy = spyOn(taskService, 'deleteTask').and.returnValue(of({}));
    component.deleteTask(mockTasks[0]);
    expect(dialogSpy).toHaveBeenCalledWith(ConfirmationDialogComponent, {
      width: '80%',
      data: { message: `Do you want to delete task ${mockTasks[0]._id}` }
    });
    expect(deleteSpy).toHaveBeenCalledWith(mockTasks[0]._id);
  });

  it('should filter tasks', () => {
    component.dataSource.data = mockTasks;
    component.applyFilter('john');
  });

  it('should toggle selection', () => {
    component.dataSource.data = mockTasks;
    component.masterToggle();
    expect(component.selection.selected.length).toBe(mockTasks.length);
    component.masterToggle();
    expect(component.selection.selected.length).toBe(0);
  });

  it('should set paginator after view init', () => {
    component.ngAfterViewInit();
    expect(component.dataSource.paginator).toBe(component.paginator);
  });
});
