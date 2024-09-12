import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';

export interface HomePagePranter {
  id?: number;
  arabicTitle: string;
  englishTitle: string;
  arabicText: string;
  englishText: string;
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class HomePagePrantersService {
  private apiUrl = `${environment.NG_APP_BASE_URL}/api/home-page-partners`;
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$: Observable<boolean> = this.isLoadingSubject.asObservable();

  constructor(private http: HttpClient, private auth: AuthService) {}

  private setLoading(loading: boolean) {
    this.isLoadingSubject.next(loading);
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.auth.getToken()}`,
      'Content-Type': 'application/json'
    });
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  getHomePagePranter(): Observable<HomePagePranter> {
    this.setLoading(true);
    return this.http.get<{code: number, results: HomePagePranter}>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(
        map(response => {
          if (response.code === 1 && response.results) {
            return response.results;
          } else {
            throw new Error('Failed to fetch Home Page Pranter');
          }
        }),
        catchError(this.handleError),
        finalize(() => this.setLoading(false))
      );
  }

  updateHomePagePranter(pranter: HomePagePranter): Observable<HomePagePranter> {
    this.setLoading(true);
    return this.http.put<{code: number, results: HomePagePranter, message: string}>(
      this.apiUrl,
      pranter,
      { headers: this.getHeaders() }
    ).pipe(
      map(response => {
        if (response.code === 1 && response.results) {
          return response.results;
        } else {
          throw new Error(response.message || 'Failed to update Home Page Pranter');
        }
      }),
      catchError(this.handleError),
      finalize(() => this.setLoading(false))
    );
  }
}