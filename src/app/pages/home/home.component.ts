import { Component, OnInit } from '@angular/core'
import * as ClipboardJS from 'clipboard'
import hljs from 'highlight.js/lib/highlight'
import json from 'highlight.js/lib/languages/json'
import { NzMessageService } from 'ng-zorro-antd'
import { TrendingService } from '../../services/trending.service'

hljs.registerLanguage('json', json)

enum SearchType {
  REPOSITORY = 'repositories',
  DEVELOPER = 'developers'
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  selectedType = ''
  selectedSince = 'daily'
  selectedLanguage = ''

  isFetchingData = false

  trendingDataString = ''

  constructor(
    private message: NzMessageService,
    private trendingService: TrendingService
  ) {}

  ngOnInit() {
    const clipboard = new ClipboardJS('#generatedUrl', {
      text(trigger: HTMLButtonElement) {
        return trigger.innerText.trim()
      }
    })
    clipboard.on('success', e => {
      this.message.success('复制成功')
      e.clearSelection()
    })
    const block = document.getElementById('trendingDataString')
    hljs.highlightBlock(block)
  }

  generatedUrl(): string {
    let url = 'https://github.com/trending'

    if (this.selectedType) {
      url += `/${this.selectedType}`
    }

    if (this.selectedLanguage) {
      url += `/${this.selectedLanguage}`
    }

    if (this.selectedSince) {
      url += `?since=${this.selectedSince}`
    }

    return url
  }

  getData() {
    return new Promise((resolve, reject) => {
      if (this.selectedType === SearchType.DEVELOPER) {
        this.trendingService.getTrendingDevelopers().subscribe(
          developers => {
            this.trendingDataString = JSON.stringify({ developers }, null, 2)
            resolve()
          },
          error => {
            this.message.error('出错了，请重试。')
            reject()
          }
        )
      } else {
        this.trendingService.getTrendingRepositories().subscribe(
          repositories => {
            this.trendingDataString = JSON.stringify({ repositories }, null, 2)
            resolve()
          },
          error => {
            this.message.error('出错了，请重试。')
            reject()
          }
        )
      }
    })
  }

  submitForm() {
    this.isFetchingData = true
    this.getData()
      .then(() => {
        const block = document.getElementById('trendingDataString')
        block.innerHTML = this.trendingDataString
        hljs.highlightBlock(block)
      })
      .finally(() => {
        this.isFetchingData = false
      })
  }
}
