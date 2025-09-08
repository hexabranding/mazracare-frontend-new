import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  $baseUrl = environment.baseUrl
    public wishlistCount = new BehaviorSubject<number>(0);
    wishlistCount$ = this.wishlistCount.asObservable();

  constructor(private http: HttpClient) { }

  refreshWishlistCount() {
    this.getWishlist().subscribe((res: any) => {
      const count = res.data.products ? res.data?.products?.length : 0;
      this.wishlistCount.next(count);
    });
  }

  addToWishlist(data: any) {
    return this.http.post(this.$baseUrl + "/wishlist/", data).pipe(
      tap(() => {
        this.refreshWishlistCount();
      })
    );
  }

  getWishlist() {
    return this.http.get( this.$baseUrl + "/wishlist")
  }

  removeItem(id: string) {
    return this.http.delete(this.$baseUrl + "/wishlist/" + id).pipe(
      tap(() => {
        this.refreshWishlistCount();
      })
    );
  }

  clearWishlist() {
    return this.http.delete(this.$baseUrl + "/wishlist")
  }
}
