import * as core from '@actions/core'
import {FeedMap} from './types'
import {fetchData} from './fetch-data'
import {removeOldEntries} from './process'

async function run(): Promise<void> {
  try {
    const oldState = JSON.parse(core.getInput('state')) as FeedMap

    const fetchedState = await fetchData({
      minScore: parseInt(core.getInput('minScore'), 10),
      time: core.getInput('time'),
      topic: core.getInput('topic')
    })

    const newState = removeOldEntries(
      {...oldState, ...fetchedState},
      parseInt(core.getInput('retention'), 10)
    )

    const items = Object.entries(newState).map(([, item]) => item)
    items.sort((a, b) => a.created - b.created)
    const jsonFeed = {
      version: 'https://jsonfeed.org/version/1',
      title: core.getInput('title'),
      feed_url: core.getInput('feedUrl'),
      items: items.reverse().map(({id, title, url, content_text}) => ({
        id,
        title,
        content_text,
        url
      }))
    }

    core.setOutput('state', JSON.stringify(newState, null, 2))
    core.setOutput('jsonFeed', jsonFeed)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
