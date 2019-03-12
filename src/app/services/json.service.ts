import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class JsonService {
  postsUrl = 'https://jsonplaceholder.typicode.com/posts?_limit=10'

  constructor(private http: HttpClient) {}

  getJson() {
    return this.http.get(this.postsUrl).toPromise()
  }
}
