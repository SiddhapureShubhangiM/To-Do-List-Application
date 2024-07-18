import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService } from '../../service/task.service';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit {
  taskForm!: FormGroup;
  users = ['User 1', 'User 2', 'User 3'];
  statuses = ['Not Started', 'In Progress', 'Completed'];
  priorities = ['High', 'Medium', 'Low'];

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    public dialogRef: MatDialogRef<TaskFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  
  }

  ngOnInit(): void {
    this.taskForm = this.fb.group({
      assignedTo: [this.data?.assignedTo, Validators.required],
      description: [this.data?.description],
      status:[this.data?.status || 'Not Started', Validators.required] ,
      dueDate: [this.data?.dueDate || new Date()],
      priority:[this.data?.priority || 'Low', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      if (this.data) {
        this.taskService.updateTask(this.data._id, this.taskForm.value).subscribe(() => {
          this.dialogRef.close(true);
        });
      } else {
        this.taskService.createTask(this.taskForm.value).subscribe(() => {
          this.dialogRef.close(true);
        });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
