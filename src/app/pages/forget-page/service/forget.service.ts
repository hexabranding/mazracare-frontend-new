import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ForgetService {
  $baseUrl = environment.baseUrl

  constructor(private http: HttpClient) { }

    forgetPassword(data: any) {
      return this.http.post( this.$baseUrl + "/password/forgot-password", data)
    }
}
