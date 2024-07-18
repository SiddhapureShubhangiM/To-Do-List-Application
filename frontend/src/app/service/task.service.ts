import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getTasks(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl+'/tasks');
  }

  createTask(task: any): Observable<any> {
    return this.http.post<any>(this.apiUrl+'/task', task);
  }

  updateTask(id: any, task: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/task/${id}`, task);
  }

  deleteTask(id:any): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl+'/task'}/${id}`);
  }
}
