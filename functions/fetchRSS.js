const Parser = require("rss-parser")
const extractImage = require("./extractImage")
const classifyTopic = require("./classifyTopic")

const parser = new Parser({
  timeout: 5000,
  headers: {
    "User-Agent": "verityn-news-app"
  }
})

async function fetchRSS(sources) {

  const articles = []

  for (const source of sources) {

    try {

      const feed = await parser.parseURL(source.url)

      if (!feed || !feed.items) continue

      for (const item of feed.items) {

        if (!item.title || !item.link) continue

        const topic = classifyTopic(item.title)

        articles.push({
  title: item.title,
  url: item.link,
  source: source.name,
  published: item.pubDate || item.isoDate || null,
  snippet: item.contentSnippet || item.content || item.description || "",
  image: null,
  topic
})

      }

    } catch (err) {

      console.log("RSS error:", source.name)

    }

  }

  const withImages = await Promise.all(

    articles.map(async (article) => {

      const image = await extractImage(article.url)

      return {
        ...article,
        image
      }

    })

  )

  return withImages

}

module.exports = fetchRSS