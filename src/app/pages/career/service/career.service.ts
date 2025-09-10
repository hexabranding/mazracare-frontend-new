import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CareerService {
  $baseUrl = environment.baseUrl

  constructor(private http: HttpClient) { }

  AddCareer(data: any) {
    return this.http.post(this.$baseUrl + "/api/career/admin", data);
  }
}
