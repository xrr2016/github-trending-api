import { Component } from '@angular/core'
import hljs from 'highlight.js/lib/highlight'
import json from 'highlight.js/lib/languages/json'
import { JsonService } from './services/json.service'

hljs.registerLanguage('javascript', json)

hljs.initHighlightingOnLoad()

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'github-trending-api'

  data: []

  constructor(private jsonService: JsonService) {}

  getJson() {
    this.jsonService.getJson().subscribe(res => {
      this.data = res.map(d => JSON.stringify(d, null, 2))
    })
  }
}
