import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { FunctionService } from '../../../../service/dataService/function.service';

@Injectable({
  providedIn: 'root'
})
export class GalleryService {

$baseUrl = environment.baseUrl

  constructor(private http: HttpClient, private _fun :FunctionService) { }


  addgallery(data:any) {
    return this.http.post( this.$baseUrl + "/gallery",data)
  }

  getgallery(params:any) {
    const param = this._fun.objectToQueryParams(params);
    return this.http.get( this.$baseUrl + "/gallery"+(param ?? ''))
  }

  deleteGallery(id:any) {
    return this.http.delete( this.$baseUrl + "/gallery/"+id)
  }

  updateGallery(id:any,data:any) {
    return this.http.put( this.$baseUrl + "/gallery/"+id,data)
  }

  getSingleGallery(id:any) {
    return this.http.get( this.$baseUrl + "/gallery/"+id)
  }

}
