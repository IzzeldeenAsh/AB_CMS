import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, finalize, Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { abUser } from 'src/app/modules/auth/models/abUser.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersManagementService {
  private getAllUsersApi = `${environment.NG_APP_BASE_URL}/api/getAllUsers`;
  private deleteUserApi = `${environment.NG_APP_BASE_URL}/api/delete-user`;
  private editUserApi = `${environment.NG_APP_BASE_URL}/api/edit-user`;
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$: Observable<boolean> = this.isLoadingSubject.asObservable();

  constructor(private http:HttpClient,private auth :AuthService) { }

  getAllUsers() : Observable<any> {
    this.isLoadingSubject.next(true);

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.auth.getToken()}`
    });

    return this.http.get(this.getAllUsersApi, {headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    )
  }

  deleteUser(userId: number): Observable<any> {
    this.isLoadingSubject.next(true);

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.auth.getToken()}`
    });

    // Using POST method with the user ID in the request body
    return this.http.post(this.deleteUserApi, { id: userId }, { headers }).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  editUser(formData: FormData): Observable<any> {
    this.isLoadingSubject.next(true);

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.auth.getToken()}`
    });

    return this.http.put(this.editUserApi, formData, { headers }).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
}
