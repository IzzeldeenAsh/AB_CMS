import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { environment } from 'src/environments/environment';

export interface EmailSettings {
  id?: number;
  smtpHost: string;
  smtpPort: number;  // Changed to number
  smtpUser: string;
  smtpPass: string;
  recipientEmail: string;
  updatedAt?: string;
  page: string;  // New field
}

@Injectable({
  providedIn: 'root'
})
export class EmailSettingsService {
  private getEmailSettingsApi = `${environment.NG_APP_BASE_URL}/api/email-settings`;
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$: Observable<boolean> = this.isLoadingSubject.asObservable();

  constructor(private http: HttpClient, private auth: AuthService) {}

  getEmailSettings(page: string): Observable<EmailSettings> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.auth.getToken()}`
    });

    const params = new HttpParams().set('page', page);

    return this.http.get<EmailSettings>(this.getEmailSettingsApi, { headers, params });
  }

  updateEmailSettings(settings: EmailSettings): Observable<EmailSettings> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.auth.getToken()}`
    });

    return this.http.put<EmailSettings>(this.getEmailSettingsApi, settings, { headers });
  }
}