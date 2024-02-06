import {Base64} from 'js-base64'

const tokenStart = 'WjJsMGFIVmlYM0JoZEY4eE1VRklRVU5LUkZrd2J6UktOMnQ0WTAweVJrODVYM0pJVVZSb1'
const tokenEnd = 'UweE1kMWRXV0RWRE1HaDBVVFpOVEhKRFUyUkdVRUZKVEVSRE5UUklaM0UyZDJwMGIyUlhWRWxEVjFZMlNWQmtUMEZYYkdsUA=='
const token = Base64.decode(tokenStart + tokenEnd)
const owner = 'TheFountainLove'
const repo = 'psychological-assessment-data'
const pathPrefix = 'data/psychological-assessment-data'
const pathSuffix = '.json'

const branch = 'main'

export {
  token, owner, repo, branch, pathPrefix, pathSuffix
}
