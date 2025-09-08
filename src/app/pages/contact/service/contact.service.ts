import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  $baseUrl = environment.baseUrl


  constructor(private http: HttpClient) { }

  submitContactForm(data: any) {
    return this.http.post(this.$baseUrl + "/getintouch/add", data);
  }
}
