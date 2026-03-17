function normalize(word) {
  word = word.toLowerCase()

  // basic stemming
  if (word.endsWith("ing")) word = word.slice(0, -3)
  if (word.endsWith("ed")) word = word.slice(0, -2)
  if (word.endsWith("s")) word = word.slice(0, -1)

  const entityMap = {
    iranian: "iran",
    israeli: "israel",
    russian: "russia",
    ukrainian: "ukraine",
    chinese: "china",
    americans: "america",
    european: "europe"
  }

  if (entityMap[word]) return entityMap[word]

  return word
}

function extractKeywords(title) {

  const stopwords = new Set([
    "the","a","an","to","of","in","on","at","for","and","or",
    "with","amid","after","before","over","under","from",
    "into","about","says","say","report","reports","live",
    "update","latest","breaking","video","analysis","new"
  ])

  const words = title
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)

  const keywords = []

  for (const w of words) {

    const word = normalize(w)

    if (word.length < 4) continue
    if (stopwords.has(word)) continue

    keywords.push(word)
  }

  return keywords
}

function createBuckets(articles) {

  const buckets = []
  const bucketIndex = new Map()

  for (const article of articles) {

    if (!article || !article.title) continue

    const keywords = extractKeywords(article.title)

    if (keywords.length < 2) {
      buckets.push([article])
      continue
    }

    // create stable bucket key using top keywords
    const keyWords = keywords.slice(0,3).sort()
    const key = keyWords.join("|")

    if (bucketIndex.has(key)) {

      const bucketId = bucketIndex.get(key)
      buckets[bucketId].push(article)

    } else {

      const bucketId = buckets.length
      bucketIndex.set(key, bucketId)
      buckets.push([article])

    }

  }

  return buckets
}

module.exports = createBuckets