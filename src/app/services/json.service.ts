import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class JsonService {
  // postsUrl = 'https://githubtrendingapi.xyz/.netlify/functions/api'
  postsUrl = 'https://jsonplaceholder.typicode.com/posts?_limit=10'

  constructor(private http: HttpClient) {}

  getJson(): Observable<any> {
    return this.http.get(this.postsUrl)
  }
}
