function filterGarbage(articles) {

  const blacklist = [
    "video:",
    "watch:",
    "live updates",
    "live blog",
    "opinion:",
    "analysis:",
    "commentary:",
    "podcast:",
    "newsletter",
    "sign up"
  ]

  return articles.filter(article => {

    const title = article.title.toLowerCase()

    for (const word of blacklist) {
      if (title.includes(word)) {
        return false
      }
    }

    return true

  })

}

module.exports = filterGarbage