import { Component, OnInit } from '@angular/core'
import hljs from 'highlight.js/lib/highlight'
import ts from 'highlight.js/lib/languages/typescript'

hljs.registerLanguage('typesript', ts)

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  developerText = `interface Developer {
  rank: number              // 排名
  avatar: string            // 头像地址
  accountName: string       // 账户名称
  userName: string          // 用户名称
  repository: string        // 仓库地址
  description: string       // 用户描述
}`

  repositoryText = `interface Repository {
  name: string              // 仓库名称
  description: string       // 仓库描述
  language: string          // 编程语言
  stars: number             // star 数
  forks: number             // fork 数
  builtBy: Array<Developer> // 参与者
}
`

  data = [
    'Racing car sprays burning fuel into crowd.',
    'Japanese princess to wed commoner.',
    'Australian walks 100km after outback crash.',
    'Man charged over missing wedding girl.',
    'Los Angeles battles huge wildfires.'
  ]

  constructor() {}

  ngOnInit() {
    document.addEventListener('DOMContentLoaded', event => {
      document.querySelectorAll('pre code').forEach(block => {
        hljs.highlightBlock(block)
      })
    })
  }
}
