import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';

export interface GridItem {
  id: string;
  image: string;
  title: any;
  text: any;
  link: {
    en: string;
    ar: string;
  };
  type: 'service' | 'subservice' | 'sector';
}

export interface UpdateGridItem {
  id: string;
  type: 'service' | 'subservice' | 'sector';
}

@Injectable({
  providedIn: 'root'
})
export class GridItemsService {
  private apiUrl = `${environment.NG_APP_BASE_URL}/api/grid/grid-cards`;
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

  getGridItems(): Observable<GridItem[]> {
    this.setLoading(true);
    return this.http.get<{code: number, results: GridItem[]}>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(
        map(response => {
          if (response.code === 1 && response.results) {
            return response.results;
          } else {
            throw new Error('Failed to fetch Grid items');
          }
        }),
        catchError(this.handleError),
        finalize(() => this.setLoading(false))
      );
  }

  updateGridItems(items: UpdateGridItem[]): Observable<any> {
    this.setLoading(true);
    return this.http.put<{code: number, results: any, message: string}>(
      this.apiUrl,
      { gridcards: items },
      { headers: this.getHeaders() }
    ).pipe(
      map(response => {
        if (response.code === 1) {
          return { results: response.results, message: response.message };
        } else {
          throw new Error(response.message || 'Failed to update Grid items');
        }
      }),
      catchError(this.handleError),
      finalize(() => this.setLoading(false))
    );
  }

}
