import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TaskService } from './task.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, HttpClientModule],
      providers: [TaskService,HttpClient],
    
    });
    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); 
  });
  it('should be created', () => {
    const service: TaskService = TestBed.inject(TaskService);
    expect(service).toBeTruthy();
  });
  it('should retrieve tasks from the API via GET', () => {
    const dummyTasks = [
      { id: 1, name: 'Task 1' },
      { id: 2, name: 'Task 2' }
    ];

    service.getTasks().subscribe(tasks => {
      expect(tasks.length).toBe(2);
      expect(tasks).toEqual(dummyTasks);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/tasks`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyTasks);
  });

  it('should create a new task via POST', () => {
    const newTask = { id: 3, name: 'Task 3' };

    service.createTask(newTask).subscribe(task => {
      expect(task).toEqual(newTask);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/task`);
    expect(req.request.method).toBe('POST');
    req.flush(newTask);
  });

  it('should update a task via PUT', () => {
    const updatedTask = { id: 1, name: 'Updated Task 1' };

    service.updateTask(1, updatedTask).subscribe(task => {
      expect(task).toEqual(updatedTask);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/task/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(updatedTask);
  });

  it('should delete a task via DELETE', () => {
    const taskId = 1;

    service.deleteTask(taskId).subscribe(response => {
      expect(response).toEqual({});
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/task/${taskId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});

