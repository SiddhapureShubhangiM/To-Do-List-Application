import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { TaskFormComponent } from '../task-form/task-form.component';
import { TaskService } from '../../service/task.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatPaginator } from '@angular/material/paginator';

export interface Task {
  _id: number;
  assignedTo: string;
  status: string;
  dueDate: Date;
  priority: string;
  
description: string;
}

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
})
export class TaskListComponent implements OnInit,AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = [
    'select',
    'assignedTo',
    'status',
    'dueDate',
    'priority',
    'comments',
    'actions',
  ];
  dataSource = new MatTableDataSource<Task>();
  selection = new SelectionModel<Task>(true, []);
  totalLength: number = 0;
  pageSize: number = 5;
  pageSizeOptions: number[] = [5,10, 20, 50];

  constructor(private taskService: TaskService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getTasks();
  }

  getTasks(): void {
    this.taskService.getTasks().subscribe((tasks: Task[]) => {
      this.dataSource.data = tasks;
      this.totalLength = tasks.length;
    });
  }

  openTaskForm(): void {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      width: '90%',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getTasks();
      }
    });
  }

  editTask(task: Task): void {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      width: '90%',
      data: task,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getTasks();
      }
    });
  }

  deleteTask(task: Task): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '80%',
      data: { message: `Do you want to delete task ${task._id}` }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.taskService.deleteTask(task._id).subscribe((response) => {
          this.getTasks();
        });
      }
    });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  applyFilter(filterValue: any) {
  
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}
