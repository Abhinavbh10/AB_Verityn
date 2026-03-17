let cache = {
  feed: null,
  timestamp: 0
}

const CACHE_TIME = 10 * 60 * 1000

function getFeedCache() {

  if (!cache.feed) return null

  if (Date.now() - cache.timestamp > CACHE_TIME) {
    return null
  }

  return cache.feed
}

function setFeedCache(feed) {

  cache.feed = feed
  cache.timestamp = Date.now()

}

module.exports = {
  getFeedCache,
  setFeedCache
}