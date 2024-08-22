import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private registerUrl = `${environment.NG_APP_BASE_URL}/api/register`;
  private signInUrl = `${environment.NG_APP_BASE_URL}/api/signin`;

  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$: Observable<boolean> = this.isLoadingSubject.asObservable();

  constructor(private http: HttpClient) {}

  registration(formData: FormData): Observable<any> {
    this.isLoadingSubject.next(true);

    return this.http.post<any>(this.registerUrl, formData).pipe(
      finalize(() => {
        this.isLoadingSubject.next(false);
      })
    );
  }

  signIn(data: { email: string; password: string }): Observable<any> {
    this.isLoadingSubject.next(true);

    return this.http.post<any>(this.signInUrl, data).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
        }
      }),
      finalize(() => {
        this.isLoadingSubject.next(false);
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getUser(): any {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  signOut(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.clear();
  }
}