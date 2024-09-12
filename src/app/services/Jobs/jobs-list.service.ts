import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';

export interface Job {
  id: number;
  interest: {
    arabic: string;
    english: string;
  };
  title: {
    arabic: string;
    english: string;
  };
  description: {
    arabic: string;
    english: string;
  };
  link: string;
  cities: Array<{
    arabic: string;
    english: string;
  }>;
  availability: string | null; // New field
}

export type JobInput = Omit<Job, 'id'>;

@Injectable({
  providedIn: 'root'
})
export class JobsService {
  private apiUrl = `${environment.NG_APP_BASE_URL}/api/jobs`;
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

  // Fetch all jobs
  getJobs(): Observable<Job[]> {
    this.setLoading(true);
    return this.http.get<{code: number, results: Job[]}>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(
        map(response => {
          if (response.code === 1 && response.results) {
            return response.results;
          } else {
            throw new Error('Failed to fetch jobs');
          }
        }),
        catchError(this.handleError),
        finalize(() => this.setLoading(false))
      );
  }

  // Fetch a specific job by ID
  getJobById(id: number): Observable<Job> {
    this.setLoading(true);
    return this.http.get<{code: number, results: Job}>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(
        map(response => {
          if (response.code === 1 && response.results) {
            return response.results;
          } else {
            throw new Error('Failed to fetch the job');
          }
        }),
        catchError(this.handleError),
        finalize(() => this.setLoading(false))
      );
  }

  // Create a new job
  createJob(job: JobInput): Observable<Job> {
    this.setLoading(true);
    const body = {
      interest: JSON.stringify(job.interest),
      title: JSON.stringify(job.title),
      description: JSON.stringify(job.description),
      link: job.link,
      cities: JSON.stringify(job.cities),
      availability: job.availability // New field
    };
    return this.http.post<{code: number, results: Job, message: string}>(
      this.apiUrl,
      body,
      { headers: this.getHeaders() }
    ).pipe(
      map(response => {
        if (response.code === 1 && response.results) {
          return response.results;
        } else {
          throw new Error(response.message || 'Failed to create job');
        }
      }),
      catchError(this.handleError),
      finalize(() => this.setLoading(false))
    );
  }

  // Update an existing job
  updateJob(job: Job): Observable<Job> {
    this.setLoading(true);
    const body = {
      id: job.id,
      interest: JSON.stringify(job.interest),
      title: JSON.stringify(job.title),
      description: JSON.stringify(job.description),
      link: job.link,
      cities: JSON.stringify(job.cities),
      availability: job.availability // New field
    };
    return this.http.put<{code: number, results: Job, message: string}>(
      `${this.apiUrl}/${job.id}`,
      body,
      { headers: this.getHeaders() }
    ).pipe(
      map(response => {
        if (response.code === 1 && response.results) {
          return response.results;
        } else {
          throw new Error(response.message || 'Failed to update job');
        }
      }),
      catchError(this.handleError),
      finalize(() => this.setLoading(false))
    );
  }
  // Delete a job by ID
  deleteJob(id: number): Observable<void> {
    this.setLoading(true);
    return this.http.delete<{code: number, message: string}>(
      `${this.apiUrl}/${id}`,
      { headers: this.getHeaders() }
    ).pipe(
      map(response => {
        if (response.code !== 1) {
          throw new Error(response.message || 'Failed to delete job');
        }
      }),
      catchError(this.handleError),
      finalize(() => this.setLoading(false))
    );
  }
}
