const Parser = require("rss-parser")
const axios = require("axios")

const parser = new Parser()

// ====== CONFIG ======
const RSS_SOURCES = [
  "http://feeds.bbci.co.uk/news/rss.xml",
  "http://rss.cnn.com/rss/edition.rss",
  "https://feeds.reuters.com/reuters/topNews",
]

// ====== HELPERS ======

function normalizeText(text = "") {
  return text.toLowerCase().replace(/[^\w\s]/gi, "")
}

function getBestImage(articles) {
  for (const a of articles) {
    if (a.image && a.image.startsWith("http")) return a.image
  }
  return "https://images.unsplash.com/photo-1504711434969-e33886168f5c"
}

function extractImage(item) {
  if (item.enclosure?.url) return item.enclosure.url
  if (item["media:content"]?.url) return item["media:content"].url

  const match = item.content?.match(/<img.*?src="(.*?)"/)
  if (match) return match[1]

  return null
}

// ====== FETCH ======

async function fetchAllFeeds() {
  const results = await Promise.allSettled(
    RSS_SOURCES.map(url => parser.parseURL(url))
  )

  let articles = []

  results.forEach(result => {
    if (result.status === "fulfilled") {
      const feed = result.value

      feed.items.forEach(item => {
        articles.push({
          title: item.title,
          url: item.link,
          source: feed.title,
          published: item.pubDate,
          snippet: item.contentSnippet,
          image: extractImage(item),
        })
      })
    }
  })

  return articles
}

// ====== CLUSTERING ======

function clusterArticles(articles) {
  const clusters = []

  articles.forEach(article => {
    const words = normalizeText(article.title).split(" ")

    let matched = false

    for (const cluster of clusters) {
      const clusterWords = normalizeText(cluster[0].title).split(" ")

      const overlap = words.filter(w => clusterWords.includes(w))

      if (overlap.length >= 3) {
        cluster.push(article)
        matched = true
        break
      }
    }

    if (!matched) clusters.push([article])
  })

  return clusters
}

// ====== SUMMARY ======

function generateSummary(cluster) {
  const top = cluster.slice(0, 3)

  return [
    top.map(a => a.title).join(". "),
    "Coverage from multiple sources indicates ongoing developments."
  ]
}

// ====== MAIN ======

module.exports = async function generateBrief() {
  console.log("Fetching feeds...")

  const articles = await fetchAllFeeds()

  console.log("Total fetched:", articles.length)

  const clusters = clusterArticles(articles)

  console.log("Clusters:", clusters.length)

  const stories = clusters
    .filter(c => c.length >= 2) // remove weak clusters
    .slice(0, 12)
    .map(cluster => {
      const summary = generateSummary(cluster)

      return {
        title: cluster[0].title,
        summary,
        image: getBestImage(cluster),
        source: cluster[0].source,
        published: cluster[0].published,
        topic: "General",

        sourceCount: new Set(cluster.map(a => a.source)).size,

        timeline: cluster.slice(0, 5).map(a => ({
          title: a.title,
          source: a.source,
          time: a.published,
        })),
      }
    })

  return {
    stories,
    feed: articles.slice(0, 50),
  }
}