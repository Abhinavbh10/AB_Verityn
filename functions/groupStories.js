function groupStories(articles) {

  const stories = []

  const stopwords = [
    "the","a","an","and","or","to","in","on","of","for","with",
    "after","before","over","under","from","by","at"
  ]

  function extractKeywords(title) {
    return title
      .toLowerCase()
      .replace(/[^\w\s]/g,"")
      .split(" ")
      .filter(w => w.length > 4 && !stopwords.includes(w))
  }

  for (const article of articles) {

    const keywords = extractKeywords(article.title)

    let matchedStory = null

    for (const story of stories) {

      const overlap = keywords.filter(k => story.keywords.has(k))

      if (overlap.length >= 1) {
        matchedStory = story
        break
      }
    }

    if (!matchedStory) {

      matchedStory = {
        title: article.title,
        articles: [],
        sources: new Set(),
        keywords: new Set(),
        importance: 0
      }

      stories.push(matchedStory)

    }

    matchedStory.articles.push(article)
    matchedStory.sources.add(article.source)

    for (const k of keywords) {
      matchedStory.keywords.add(k)
    }

  }

  return stories
}

module.exports = groupStories