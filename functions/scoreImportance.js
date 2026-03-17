function scoreImportance(stories) {

  const trustedSources = [
    "BBC",
    "Reuters",
    "Associated Press",
    "New York Times",
    "Financial Times",
    "Bloomberg",
    "Wall Street Journal",
    "Guardian",
    "CNBC"
  ]

  const now = Date.now()

  for (const story of stories) {

    let importance = 0

    // 1️⃣ Multiple sources = higher credibility
    if (story.sources) {
      importance += story.sources.size * 2
    }

    // 2️⃣ More articles = bigger story
    if (story.articles) {
      importance += story.articles.length
    }

    // 3️⃣ Trusted source bonus
    if (story.sources) {
      for (const src of story.sources) {
        if (trustedSources.includes(src)) {
          importance += 2
        }
      }
    }

    // 4️⃣ Freshness bonus (last 6 hours)
    if (story.articles && story.articles[0] && story.articles[0].published) {

      const published = new Date(story.articles[0].published).getTime()
      const ageHours = (now - published) / (1000 * 60 * 60)

      if (ageHours < 6) importance += 5
      else if (ageHours < 12) importance += 3
      else if (ageHours < 24) importance += 1

    }

    story.importance = importance
  }

  // sort highest importance first
  stories.sort((a, b) => b.importance - a.importance)

  return stories
}

module.exports = scoreImportance