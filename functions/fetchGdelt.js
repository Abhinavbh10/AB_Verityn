const axios = require("axios")

let cache = []
let lastFetch = 0

async function fetchGdelt() {

  const now = Date.now()

  // use cached data if fetched within last 10 minutes
  if (cache.length && now - lastFetch < 10 * 60 * 1000) {
    return cache
  }

  try {

    const url =
      "https://api.gdeltproject.org/api/v2/doc/doc?query=world&mode=ArtList&format=json&maxrecords=50"

    const res = await axios.get(url, {
      timeout: 10000,
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    })

    if (!res.data || !res.data.articles) {
      return []
    }

    const articles = res.data.articles.map(a => ({
      title: a.title,
      url: a.url,
      source: a.sourceCommonName || "GDELT",
      published: a.seendate || null,
      image: a.socialimage || null,
      topic: "World"
    }))

    cache = articles
    lastFetch = now

    return articles

  } catch (err) {

    console.log("GDELT rate limited — using cached data")

    return cache
  }

}

module.exports = fetchGdelt