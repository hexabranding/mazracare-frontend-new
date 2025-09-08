import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  $baseUrl = environment.baseUrl

  constructor(private http: HttpClient) { }

   verifyEmail(data: any) {
      return this.http.post( this.$baseUrl + "/auth/verify-email", data)
    }
}
