function filterByTopic(stories, topic) {

  if (!topic) return stories

  const target = topic.toLowerCase()

  return stories.filter(story => {

    if (!story.topic) return false

    return story.topic.toLowerCase() === target

  })

}

module.exports = filterByTopic