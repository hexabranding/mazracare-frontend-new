import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  $baseUrl = environment.baseUrl

  public islogin = new BehaviorSubject < boolean > (false);
  islogin$ = this.islogin.asObservable();
  public currentUserSubject = new BehaviorSubject < any > (this.getUserFromStorage());
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}


  setUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  getUserFromStorage() {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }

  login(data: any) {
    return this.http.post(this.$baseUrl + "/auth/signin", data).pipe(
      tap((res: any) => {
        if (res && res.token) {
          ;
          this.islogin.next(true);
        }
      })
    );
  }
}
