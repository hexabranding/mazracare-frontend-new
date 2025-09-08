import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  $baseUrl = environment.baseUrl


  constructor(private http: HttpClient) { }

  placeOrderFromCart (data: any) {
    return this.http.post(this.$baseUrl + "/order", data);
  }

  directOrder(data: any) {
    return this.http.post(this.$baseUrl + "/order/direct", data);
  }
}
