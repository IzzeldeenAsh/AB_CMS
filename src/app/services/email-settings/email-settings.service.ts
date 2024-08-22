import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environment';
import { BehaviorSubject, Observable, finalize } from 'rxjs';
import { AuthService } from '../auth/auth.service';

export interface EmailSettings {
  id:number,
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
  smtpPass: string;
  recipientEmail: string;
  updatedAt?:string;
}

@Injectable({
  providedIn: 'root'
})
export class EmailSettingsService {
  private getEmailSettingsApi = `${environment.NG_APP_BASE_URL}/api/email-settings`;
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$: Observable<boolean> = this.isLoadingSubject.asObservable();
  constructor(private http: HttpClient, private auth: AuthService) {}

  getEmailSettings(): Observable<EmailSettings> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.auth.getToken()}`
    });

    return this.http.get<EmailSettings>(this.getEmailSettingsApi, { headers });
  }

  updateEmailSettings(settings: EmailSettings): Observable<EmailSettings> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.auth.getToken()}`
    });

    return this.http.put<EmailSettings>(this.getEmailSettingsApi, settings, { headers });
  }
}