function prioritizeTopics(stories, interests = []) {

  if (!interests || interests.length === 0) {
    return stories
  }

  const interestSet = new Set(
    interests.map(i => i.toLowerCase())
  )

  const preferred = []
  const others = []

  for (const story of stories) {

    const topic = (story.topic || "").toLowerCase()

    if (interestSet.has(topic)) {
      preferred.push(story)
    } else {
      others.push(story)
    }

  }

  return [...preferred, ...others]

}

module.exports = prioritizeTopics