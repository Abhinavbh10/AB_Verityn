function searchStories(stories, keyword) {

  if (!keyword) return stories

  const query = keyword.toLowerCase()

  return stories.filter(story => {

    const title = story.title?.toLowerCase() || ""
    const source = story.source?.toLowerCase() || ""
    const summary = (story.summary || []).join(" ").toLowerCase()

    return (
      title.includes(query) ||
      source.includes(query) ||
      summary.includes(query)
    )

  })

}

module.exports = searchStories