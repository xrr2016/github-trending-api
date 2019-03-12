const Crawler = require('crawler')

const crawler = new Crawler({
  maxConnections: 10
})

const TRENDING_URL = 'https://github.com/trending'

function toNumber(string) {
  if (!string) {
    return
  }
  return parseInt(string.match(/\d/g).join(''))
}

// type
// - developers
// - repositories

// since
// - daily
// - weekly
// - monthly

// language
// - all

// https://github.com/trending/html?since=weekly
// https://github.com/trending/developers/javascript?since=weekly

function trendingSearch(type = 'repositories', language = '', since = 'daily') {
  const results = []
  const lan = language ? `/${language}` : ''
  const uri = `${TRENDING_URL}/${type}${lan}?since=${since}`

  return new Promise((resolve, reject) => {
    crawler.direct({
      uri,
      callback: (error, response) => {
        if (error) {
          reject(results, error)
        } else {
          const $ = response.$
          const list = $('div.explore-content li')

          list.each((index, item) => {
            let result = null
            const $item = $(item)

            if (type === 'repositories') {
              const name = $item
                .find('div.mb-1 a')
                .attr('href')
                .slice(1)
              const description = $item
                .find('.py-1 p')
                .text()
                .trim()
              const language = $item
                .find('span[itemprop=programmingLanguage]')
                .text()
                .trim()
              const stars = toNumber(
                $item
                  .find('a.muted-link')
                  .eq(0)
                  .text()
                  .trim()
              )
              const starsToday = toNumber(
                $item
                  .find('span.float-sm-right')
                  .text()
                  .trim()
              )
              const forks = toNumber(
                $item
                  .find('a.muted-link')
                  .eq(1)
                  .text()
                  .trim()
              )
              const builtBy = []

              $item.find('img.avatar').each((index, item) => {
                const $this = $(item)
                builtBy.push({
                  name: $this.attr('alt').slice(1),
                  avatar: $this.attr('src').split('?')[0]
                })
              })

              result = {
                name,
                description,
                language,
                stars,
                starsToday,
                forks,
                builtBy
              }
            } else if (type === 'developers') {
              const rank = parseInt($item.find('a.text-center').text())
              const avatar = $item
                .find('img.rounded-1')
                .attr('src')
                .split('?')[0]
              const accountName = $item
                .find('img.rounded-1')
                .attr('alt')
                .slice(1)
              const userName = $item
                .find('span.text-bold')
                .text()
                .trim()
                .replace('(', '')
                .replace(')', '')
              const repository = $item.find('span.repo').attr('title')
              const description = $item
                .find('span.repo-snipit-description')
                .text()
                .trim()

              result = {
                rank,
                avatar,
                accountName,
                userName,
                repository,
                description
              }
            }

            results.push(result)
          })

          resolve(results)
        }
      }
    })
  })
}

exports.handler = async (event, context, callback) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  const { type, since, language } = event.queryStringParameters

  const data = await trendingSearch(type, since, language)

  callback(null, {
    statusCode: 200,
    body: {
      data,
      query: queryStringParameters
    }
  })
}
