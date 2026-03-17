const fetchRSS = require("./fetchRSS")
const rssSources = require("./rssSources")

const fetchGdelt = require("./fetchGdelt")
const fetchGoogleTopics = require("./googleTopics")

async function fetchNews() {

  let rssArticles = []
  let googleArticles = []
  let gdeltArticles = []

  try {
    rssArticles = await fetchRSS(rssSources)
  } catch (err) {
    console.log("RSS error")
  }

  try {
    googleArticles = await fetchGoogleTopics()
  } catch (err) {
    console.log("Google Topics error")
  }

  try {
    gdeltArticles = await fetchGdelt()
  } catch (err) {
    console.log("GDELT fetch error")
  }

  const allArticles = [
    ...rssArticles,
    ...googleArticles,
    ...gdeltArticles
  ]

  return allArticles.map(a => ({
    title: a.title,
    url: a.url,
    source: a.source || "Unknown",
    published: a.published || null,
    snippet: a.snippet || "",
    image: a.image || null,
    topic: a.topic || "General"
  }))
}

module.exports = fetchNews