import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';

export interface TimelineEntry {
  id?: string;
  year: string;
  titleEnglish: string;
  titleArabic: string;
  contentEnglish: string;
  contentArabic: string;
  logo?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TimelineService {
  private apiUrl = `${environment.NG_APP_BASE_URL}/api/timeline`;
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$: Observable<boolean> = this.isLoadingSubject.asObservable();

  constructor(private http: HttpClient, private auth: AuthService) {}

  private setLoading(loading: boolean) {
    this.isLoadingSubject.next(loading);
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.auth.getToken()}`,
      'Content-Type': 'application/json',
      
    });
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  // Fetch all timeline entries
  getTimeline(): Observable<TimelineEntry[]> {
    this.setLoading(true);
    return this.http.get<{code: number, results: TimelineEntry[]}>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(
        map(response => {
          if (response.code === 1 && response.results) {
            return response.results;  
          } else {
            throw new Error('Failed to fetch Timeline');
          }
        }),
        catchError(this.handleError),
        finalize(() => this.setLoading(false))
      );
  }

  // Update an existing timeline entry
  updateTimelineEntry(entry: TimelineEntry): Observable<TimelineEntry> {
    this.setLoading(true);
    return this.http.put<{code: number, results: TimelineEntry, message: string}>(
      `${this.apiUrl}/${entry.id}`,
      entry,
      { headers: this.getHeaders() }
    ).pipe(
      map(response => {
        if (response.code === 1 && response.results) {
          return response.results;
        } else {
          throw new Error(response.message || 'Failed to update Timeline entry');
        }
      }),
      catchError(this.handleError),
      finalize(() => this.setLoading(false))
    );
  }
}
