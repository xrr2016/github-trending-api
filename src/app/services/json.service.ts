import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class JsonService {
  postsUrl = 'https://githubtrendingapi.xyz/.netlify/functions/api'

  constructor(private http: HttpClient) {}

  getJson() {
    return this.http.get(this.postsUrl).toPromise()
  }
}
