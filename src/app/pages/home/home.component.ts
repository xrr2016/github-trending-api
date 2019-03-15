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

const TRENDING_PAGE_URL = 'https://github.com/trending'
const API_ENPOINT = 'https://githubtrendingapi.xyz/.netlify/functions/trending'

const testQuestionMark = (str: string) => /\?/.test(str)

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

  languages = [
    { label: 'all', value: '' },
    { label: 'unknown', value: 'unknown' },
    { label: 'css', value: 'css' },
    { label: 'go', value: 'go' },
    { label: 'html', value: 'html' },
    { label: 'javascript', value: 'javascript' },
    { label: 'python', value: 'python' },
    { label: 'typescript', value: 'typescript' },
    { label: 'vue', value: 'vue' },
    { label: 'java', value: 'java' },
    { label: 'dart', value: 'dart' },
    { label: 'json', value: 'json' },
    { label: 'shell', value: 'shell' },
    { label: 'php', value: 'php' },
    { label: 'ruby', value: 'ruby' },
    { label: 'c', value: 'c' },
    { label: 'c#', value: 'c%23' }
  ]

  constructor(
    private message: NzMessageService,
    private trendingService: TrendingService
  ) {}

  ngOnInit() {
    const clipboard = new ClipboardJS('#generatedUrl', {
      text(trigger: HTMLButtonElement) {
        return trigger.previousElementSibling.innerHTML.trim()
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
    let url = API_ENPOINT

    if (this.selectedType) {
      if (testQuestionMark(url)) {
        url += `&type=${this.selectedType}`
      } else {
        url += `?type=${this.selectedType}`
      }
    }

    if (this.selectedLanguage) {
      if (testQuestionMark(url)) {
        url += `&language=${this.selectedLanguage}`
      } else {
        url += `?language=${this.selectedLanguage}`
      }
    }

    if (this.selectedSince) {
      if (testQuestionMark(url)) {
        url += `&since=${this.selectedSince}`
      } else {
        url += `?since=${this.selectedSince}`
      }
    }

    return url
  }

  generateTrendingPageUrl(): string {
    let url = TRENDING_PAGE_URL

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
        this.trendingService
          .getTrendingDevelopers(this.selectedSince, this.selectedLanguage)
          .subscribe(
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
        this.trendingService
          .getTrendingRepositories(this.selectedSince, this.selectedLanguage)
          .subscribe(
            repositories => {
              this.trendingDataString = JSON.stringify(
                { repositories },
                null,
                2
              )
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
