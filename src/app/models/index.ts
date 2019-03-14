export interface Developer {
  rank: number
  avatar: string
  accountName: string
  userName: string
  repository: string
  description: string
}

export interface Repository {
  name: string
  description: string
  language: string
  stars: number
  forks: number
  builtBy: Array<Developer>
}
