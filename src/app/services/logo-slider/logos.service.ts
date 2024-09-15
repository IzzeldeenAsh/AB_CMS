import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';

export interface Logo {
  id: number;
  image: string;
  alt: string;
  link: string;
}

export interface LogoCreateData {
  image: File;
  alt: string;
  link: string;
}

@Injectable({
  providedIn: 'root'
})
export class LogosService {
  private apiUrl = `${environment.NG_APP_BASE_URL}/api/logos`;
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$: Observable<boolean> = this.isLoadingSubject.asObservable();

  constructor(private http: HttpClient, private auth: AuthService) {}

  private setLoading(loading: boolean) {
    this.isLoadingSubject.next(loading);
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.auth.getToken()}`
    });
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  getLogos(): Observable<Logo[]> {
    this.setLoading(true);
    return this.http.get<{code: number, results: Logo[]}>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(
        map(response => {
          if (response.code === 1 && response.results) {
            return response.results;
          } else {
            throw new Error('Failed to fetch logos data');
          }
        }),
        catchError(this.handleError),
        finalize(() => this.setLoading(false))
      );
  }

  createLogo(logoData: LogoCreateData): Observable<Logo> {
    this.setLoading(true);
    const formData = new FormData();
    
    formData.append('image', logoData.image);
    formData.append('alt', logoData.alt);
    formData.append('link', logoData.link);

    return this.http.post<{code: number, results: Logo, message: string}>(
      this.apiUrl, 
      formData, 
      { headers: this.getHeaders() }
    ).pipe(
      map(response => {
        if (response.code === 1 && response.results) {
          return response.results;
        } else {
          throw new Error(response.message || 'Failed to create logo');
        }
      }),
      catchError(this.handleError),
      finalize(() => this.setLoading(false))
    );
  }

  deleteLogo(id: number): Observable<void> {
    this.setLoading(true);
    return this.http.delete<{code: number, message: string}>(
      `${this.apiUrl}/${id}`,
      { headers: this.getHeaders() }
    ).pipe(
      map(response => {
      
      }),
      catchError(this.handleError),
      finalize(() => this.setLoading(false))
    );
  }
}