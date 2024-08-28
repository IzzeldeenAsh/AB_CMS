import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';
import { SectorResponse } from 'src/app/models/getsectorsDTO.interface';

@Injectable({
  providedIn: 'root'
})
export class SectorsService {
  private apiUrl = `${environment.NG_APP_BASE_URL}/api/sectors`;
  
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$: Observable<boolean> = this.isLoadingSubject.asObservable();

  constructor(private http: HttpClient, private auth: AuthService) {}

  private setLoading(loading: boolean) {
    this.isLoadingSubject.next(loading);
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.auth.getToken()}`
    });
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError('Something bad happened; please try again later.');
  }

  getSectors(): Observable<SectorResponse> {
    this.setLoading(true);
    return this.http.get<SectorResponse>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError),
        finalize(() => this.setLoading(false))
      );
  }

  createSector(formData: FormData): Observable<any> {
    this.setLoading(true);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.auth.getToken()}`
    });
    return this.http.post<any>(this.apiUrl, formData, { headers })
      .pipe(
        catchError(this.handleError),
        finalize(() => this.setLoading(false))
      );
  }

  getSectorById(id: string): Observable<any> {
    this.setLoading(true);
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError),
        finalize(() => this.setLoading(false))
      );
  }

  updateSector(id: string, formData: FormData): Observable<any> {
    this.setLoading(true);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.auth.getToken()}`
    });
    return this.http.put<any>(`${this.apiUrl}/${id}`, formData, { headers })
      .pipe(
        catchError(this.handleError),
        finalize(() => this.setLoading(false))
      );
  }

  deleteSector(id: string): Observable<any> {
    this.setLoading(true);
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError),
        finalize(() => this.setLoading(false))
      );
  }
}