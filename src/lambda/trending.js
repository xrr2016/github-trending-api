import cheerio from 'cheerio'
import fetch from 'node-fetch'

const URL = 'https://github.com/trending'

const toLower = string => (string ? string.toLowerCase() : '')
const toNumber = string => (string ? parseInt(string.match(/\d/g).join('')) : 0)

// https://github.com/trending/developers?since=weekly

function generateUrl(type = '', language = '', since = '') {
  let url = URL

  if (type) {
    url += `/${toLower(type)}`
  }

  if (language) {
    url += `/${toLower(language)}`
  }

  if (since) {
    url += `?since=${toLower(since)}`
  }

  return url
}

exports.handler = async (event, context) => {
  const { type, since, language } = event.queryStringParameters

  const url = generateUrl(type, language, since)

  console.log('type :', type)
  console.log('language :', language)
  console.log('since :', since)
  console.log('url :', url)

  return fetch(url)
    .then(response => response.text())
    .then(html => {
      const results = []
      const $ = cheerio.load(html)
      const $list = $('div.explore-content li')

      $list.each((index, item) => {
        let result = null
        const $item = $(item)

        if (type === 'developers') {
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
        } else {
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
        }

        results.push(result)
      })

      return results
    })
    .then(results => ({
      statusCode: 200,
      headers: {
        'Contype-type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept'
      },
      body: JSON.stringify(results)
    }))
    .catch(error => ({ statusCode: 422, body: String(error) }))
}
