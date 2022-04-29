# Reddit to RSS Action
<p align="center">
  <a href="https://github.com/actions/typescript-action/actions"><img alt="typescript-action status" src="https://github.com/actions/typescript-action/workflows/build-test/badge.svg"></a>
</p>


> Transformed a Reddit topic to a RSS Feed

Example

```yaml
# get the state from the previous run
  - id: rprogrammingstate
        run: echo ::set-output name=state::$(cat rprogramming.state.json)



  - uses: ste-xx/reddit-to-rss-action@main
    with:
      state: ${{ steps.rprogrammingstate.outputs.state }}
      topic: r/programming
      feedUrl: https://raw.githubusercontent.com/ste-xx/rss-watch/main/rprogramming.json
      title: r/programming
    id: rprogramming


# write feed to file
  - run: | 
      cat <<EOF > rprogramming.json
      ${{ steps.rprogramming.outputs.jsonFeed }}
      EOF
  
# write state for the next run
  - run: | 
     cat <<EOF > rprogramming.state.json
     ${{ steps.rprogramming.outputs.state }}
     EOF
``` 

A running workflow can be found [here](https://github.com/ste-xx/rss-watch)


## Options
| Name  | Description | Type | DefaultValue | Mandatory |
| ----- | ----------- | ---- | ------------ | --------- | 
| topic | Reddit topic which will be observed. | 'r/topic' |  | ✅ 
| time  | Timerange which will be observed | 'week' | 'week' |
| minScore  | Min score to fetch entry | 'Number' | '500' |
| title | Title for the Rss feed | String | 'Reddit' |
| feedUrl | Url where the generated feed is reachable. | URL |  | ✅ 
| state | Hold the state from the previous run. If not set a flickering rss feed could occur, because entries could match the criteria and the next run the criteria is not met.  | Stringified Object | '{}' | 
| retention | How long an entry will be preserved, even if the criteria is not met. | 'Number' | '10' |
