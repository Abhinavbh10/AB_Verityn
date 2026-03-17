const fetchRSS = require("./fetchRSS")
const rssSourcesByTopic = require("./rssSourcesByTopic")

async function fetchTopicFeeds() {

  const allArticles = []

  for (const topic of Object.keys(rssSourcesByTopic)) {

    const sources = rssSourcesByTopic[topic]

    try {

      const articles = await fetchRSS(sources)

      for (const article of articles) {
        article.topic = topic
      }

      allArticles.push(...articles)

    } catch (err) {

      console.log("Topic RSS error:", topic)

    }

  }

  return allArticles

}

module.exports = fetchTopicFeeds