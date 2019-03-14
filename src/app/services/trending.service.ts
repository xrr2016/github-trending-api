import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { Developer, Repository } from '../models'

@Injectable({
  providedIn: 'root'
})
export class TrendingService {
  private base = '/.netlify/functions/trending'

  constructor(private http: HttpClient) {}

  getTrendingDevelopers(
    since: string = '',
    language: string = ''
  ): Observable<Developer[]> {
    let url = `${this.base}?type=developers`

    if (language) {
      url += `&language=${language}`
    }

    if (since) {
      url += `&since=${since}`
    }

    return this.http.get<Developer[]>(url)
  }

  getTrendingRepositories(
    since: string = '',
    language: string = ''
  ): Observable<Repository[]> {
    let url = `${this.base}`

    if (language) {
      url += `?language=${language}`
    }

    if (since) {
      if (language) {
        url += `&since=${since}`
      } else {
        url += `?since=${since}`
      }
    }

    return this.http.get<Repository[]>(url)
  }
}
