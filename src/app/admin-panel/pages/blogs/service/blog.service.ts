import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { FunctionService } from '../../../../service/dataService/function.service';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
$baseUrl = environment.baseUrl

constructor(private http: HttpClient, private _fun :FunctionService) { }

addBlog(blogData: any) {
    return this.http.post(this.$baseUrl + "/blog", blogData);
}

getBlogs(params?:any) {
  const param = this._fun.objectToQueryParams(params);
  return this.http.get(this.$baseUrl + "/blog"+(param ?? ''));
}

getBlogId(id: string) {
  return this.http.get(this.$baseUrl + "/blog/" + id);
}

updateBlog(id: string, blogData: any) {
  return this.http.put(this.$baseUrl + "/blog/" + id, blogData);
}

deleteBlog(id: string) {
  return this.http.delete(this.$baseUrl + "/blog/" + id);
}

}
