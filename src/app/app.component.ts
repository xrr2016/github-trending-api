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

  code = 'aaaa'

  constructor(private jsonService: JsonService) {}

  getJson() {
    this.jsonService.getJson().then(data => {
      console.log('data :', data)
      // this.code = JSON.stringify(data, () => {}, 2)
      this.code = JSON.stringify(data)
    })
  }
}
