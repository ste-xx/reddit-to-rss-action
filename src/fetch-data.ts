import {FeedMap} from './types'
import {HttpClient} from '@actions/http-client'

interface RedditResponse {
  data: {
    children: {
      data: {
        id: string
        title: string
        score: number
        permalink: string
      }
    }[]
  }
}

interface Input {
  topic: string
  minScore: number
  time: string
}

export const fetchData = async (input: Input): Promise<FeedMap> => {
  const url = new URL(`https://www.reddit.com/${input.topic}/top/.json`)
  url.searchParams.append('t', input.time)

  const client = new HttpClient()
  const response = await client.getJson<RedditResponse>(url.toString())
  const posts = response.result?.data.children ?? []

  return Object.fromEntries(
    posts
      .map(({data}) => data)
      .filter(({score}) => score >= input.minScore)
      .map(({id, title, score, permalink}) => [
        id,
        {
          id,
          url: `https://reddit.com${permalink}`,
          created: new Date().getTime(),
          title: `${title} (${score})`,
          content_text: ``
        }
      ])
  )
}
