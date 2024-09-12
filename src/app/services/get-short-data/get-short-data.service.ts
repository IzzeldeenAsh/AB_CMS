import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';

export interface CombinedDataItem {
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

export interface CombinedData {
  services: CombinedDataItem[];
  subservices: CombinedDataItem[];
  sectors: CombinedDataItem[];
}

@Injectable({
  providedIn: 'root'
})
export class CombinedDataService {
  private apiUrl = `${environment.NG_APP_BASE_URL}/api/featured/get-combined-data`;
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

  getCombinedData(): Observable<CombinedData> {
    this.setLoading(true);
    return this.http.get<{code: number, results: CombinedData}>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(
        map(response => {
          if (response.code === 1 && response.results) {
            return response.results;
          } else {
            throw new Error('Failed to fetch combined data');
          }
        }),
        catchError(this.handleError),
        finalize(() => this.setLoading(false))
      );
  }
}