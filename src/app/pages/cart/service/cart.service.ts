import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  $baseUrl = environment.baseUrl
  public cartItemCount = new BehaviorSubject<number>(0);
  cartItemCount$ = this.cartItemCount.asObservable();

  constructor(private http: HttpClient) { }

  refreshCartCount() {
    this.cartList().subscribe((res:any) => {
      const count = res.data.items ? res.data?.items?.length : 0;
      this.cartItemCount.next(count);
    });

  }

  addToCart(data: any) {
    return this.http.post(this.$baseUrl + "/cart/add", data).pipe(
      tap(() => {
        this.refreshCartCount();
      })
    );
  }

  cartList() {
    return this.http.get( this.$baseUrl + "/cart")
  }

  removeItem(id: string) {
    return this.http.delete(this.$baseUrl + "/cart/remove/" + id).pipe(
      tap(() => {
        this.refreshCartCount();
      })
    );
  }

  updateCartItemQuanity(id: string, data: any) {
    return this.http.put(this.$baseUrl + "/cart/update/" + id, data)
  }
}
