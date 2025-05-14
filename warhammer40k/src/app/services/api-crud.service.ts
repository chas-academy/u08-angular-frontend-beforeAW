import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiCrudService {
  private http = inject(HttpClient);
  private apiUrl = 'https://u05-beforeaw-wh-40k-api.vercel.app/api';
  
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  getAll<T>(endpoint: string): Observable<T[]> {
    return this.http.get<T[]>(`${this.apiUrl}/${endpoint}`)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  getOne<T>(endpoint: string, id: number | string): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${endpoint}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  postOne<T>(endpoint: string, item: T): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}/${endpoint}`, item, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateOne<T>(endpoint: string, id: number | string, item: T): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}/${endpoint}/${id}`, item, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteOne(endpoint: string, id: number | string): Observable<unknown> {
    return this.http.delete(`${this.apiUrl}/${endpoint}/${id}`, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}