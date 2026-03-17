const Parser = require("rss-parser")
const parser = new Parser()

const topics = [
  "WORLD",
  "BUSINESS",
  "TECHNOLOGY",
  "SCIENCE"
]

async function fetchGoogleTopics() {

  const articles = []

  for (const topic of topics) {

    try {

      const url = `https://news.google.com/rss/headlines/section/topic/${topic}?hl=en-US&gl=US&ceid=US:en`

      const feed = await parser.parseURL(url)

      for (const item of feed.items) {

        articles.push({
          title: item.title,
          url: item.link,
          source: "Google News",
          topic: topic
        })

      }

    } catch (err) {

      console.log("Google topic failed:", topic)

    }

  }

  return articles

}

module.exports = fetchGoogleTopics