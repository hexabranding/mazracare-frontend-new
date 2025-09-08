import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductDetailsService {
  $baseUrl = environment.baseUrl

  constructor(private http: HttpClient) { }

  productDetails(id: string) {
    return this.http.get( this.$baseUrl + `/products/${id}`);

  }
}
