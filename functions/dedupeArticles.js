function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(" ")
    .filter(Boolean)
}

function similarity(a, b) {
  const setA = new Set(a)
  const setB = new Set(b)

  let overlap = 0

  for (const word of setA) {
    if (setB.has(word)) overlap++
  }

  return overlap / Math.max(setA.size, setB.size)
}

function dedupeArticles(articles) {

  const result = []

  for (const article of articles) {

    const wordsA = normalize(article.title)

    let duplicate = false

    for (const existing of result) {

      const wordsB = normalize(existing.title)

      const sim = similarity(wordsA, wordsB)

      if (sim > 0.45) {
        duplicate = true
        break
      }

    }

    if (!duplicate) {
      result.push(article)
    }

  }

  return result
}

module.exports = dedupeArticles