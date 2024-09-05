import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';

export interface HeroContent {
  english: string;
  arabic: string;
}

export interface Hero {
  id: number;
  heroImage: string;
  heroSlogan: HeroContent;
  heroTitle: HeroContent;
  heroDescription: HeroContent;
}

export interface HeroUpdateData {
  heroImage?: File;
  heroSlogan: HeroContent;
  heroTitle: HeroContent;
  heroDescription: HeroContent;
}

@Injectable({
  providedIn: 'root'
})

export class HeroService {
  private apiUrl = `${environment.NG_APP_BASE_URL}/api/hero`;
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

  getHero(): Observable<Hero> {
    this.setLoading(true);
    return this.http.get<{code: number, results: Hero}>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(
        map(response => {
          if (response.code === 1 && response.results) {
            return response.results;
          } else {
            throw new Error('Failed to fetch hero data');
          }
        }),
        catchError(this.handleError),
        finalize(() => this.setLoading(false))
      );
  }

  updateHero(heroData: HeroUpdateData): Observable<Hero> {
    this.setLoading(true);
    const formData = new FormData();
    
    if (heroData.heroImage) {
      formData.append('heroImage', heroData.heroImage);
    }
    
    formData.append('heroSlogan', JSON.stringify(heroData.heroSlogan));
    formData.append('heroTitle', JSON.stringify(heroData.heroTitle));
    formData.append('heroDescription', JSON.stringify(heroData.heroDescription));

    return this.http.put<{code: number, results: Hero, message: string}>(
      this.apiUrl, 
      formData, 
      { headers: this.getHeaders() }
    ).pipe(
      map(response => {
        if (response.code === 1 && response.results) {
          return response.results;
        } else {
          throw new Error(response.message || 'Failed to update hero data');
        }
      }),
      catchError(this.handleError),
      finalize(() => this.setLoading(false))
    );
  }
}