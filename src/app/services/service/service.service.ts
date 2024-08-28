import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private apiUrl = `${environment.NG_APP_BASE_URL}/api/services`;
  
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.isLoadingSubject.asObservable();

  constructor(private http: HttpClient, private auth: AuthService) {}

  private setLoading(loading: boolean) {
    this.isLoadingSubject.next(loading);
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.auth.getToken()}`
    });
  }

  getAllServices(): Observable<any> {
    this.setLoading(true);
    return this.http.get<any>(this.apiUrl, { headers: this.getHeaders() }).pipe(
      finalize(() => this.setLoading(false))
    );
  }

  getServiceById(id: string): Observable<any> {
    this.setLoading(true);
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
      finalize(() => this.setLoading(false))
    );
  }

  createService(formData: FormData): Observable<any> {
    this.setLoading(true);
    return this.http.post<any>(this.apiUrl, formData, { headers: this.getHeaders() }).pipe(
      finalize(() => this.setLoading(false))
    );
  }

  updateService(id: string, formData: FormData): Observable<any> {
    this.setLoading(true);
    return this.http.put<any>(`${this.apiUrl}/${id}`, formData, { headers: this.getHeaders() }).pipe(
      finalize(() => this.setLoading(false))
    );
  }

  deleteService(id: string): Observable<any> {
    this.setLoading(true);
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
      finalize(() => this.setLoading(false))
    );
  }
}