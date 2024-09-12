import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';

export interface AboutUsContent {
  english: string;
  arabic: string;
}

export interface AboutUs {
  id: number;
  image: string;
  introTitle: AboutUsContent;
  title: AboutUsContent;
  contentHtml: AboutUsContent;
  mission: AboutUsContent;
}

export interface AboutUsUpdateData {
  image?: File;
  introTitle: AboutUsContent;
  title: AboutUsContent;
  contentHtml: AboutUsContent;
  mission: AboutUsContent;
}

@Injectable({
  providedIn: 'root'
})
export class AboutUsService {
  private apiUrl = `${environment.NG_APP_BASE_URL}/api/about-us`;
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

  getAboutUs(): Observable<AboutUs> {
    this.setLoading(true);
    return this.http.get<{code: number, results: AboutUs}>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(
        map(response => {
          if (response.code === 1 && response.results) {
            return response.results;
          } else {
            throw new Error('Failed to fetch About Us data');
          }
        }),
        catchError(this.handleError),
        finalize(() => this.setLoading(false))
      );
  }

  updateAboutUs(aboutUsData: AboutUsUpdateData): Observable<AboutUs> {
    this.setLoading(true);
    const formData = new FormData();
    
    if (aboutUsData.image) {
      formData.append('image', aboutUsData.image);
    }
    
    formData.append('introTitle', JSON.stringify(aboutUsData.introTitle));
    formData.append('title', JSON.stringify(aboutUsData.title));
    formData.append('contentHtml', JSON.stringify(aboutUsData.contentHtml));
    formData.append('mission', JSON.stringify(aboutUsData.mission));

    return this.http.put<{code: number, results: AboutUs, message: string}>(
      this.apiUrl, 
      formData, 
      { headers: this.getHeaders() }
    ).pipe(
      map(response => {
        if (response.code === 1 && response.results) {
          return response.results;
        } else {
          throw new Error(response.message || 'Failed to update About Us data');
        }
      }),
      catchError(this.handleError),
      finalize(() => this.setLoading(false))
    );
  }
}