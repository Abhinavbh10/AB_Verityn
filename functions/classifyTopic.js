function classifyTopic(title) {

  const text = title.toLowerCase()

  if (
    text.includes("ai") ||
    text.includes("tech") ||
    text.includes("software") ||
    text.includes("chip") ||
    text.includes("startup") ||
    text.includes("google") ||
    text.includes("apple") ||
    text.includes("microsoft")
  ) {
    return "Technology"
  }

  if (
    text.includes("market") ||
    text.includes("stocks") ||
    text.includes("oil") ||
    text.includes("inflation") ||
    text.includes("fed") ||
    text.includes("economy")
  ) {
    return "Markets"
  }

  if (
    text.includes("election") ||
    text.includes("government") ||
    text.includes("policy") ||
    text.includes("senate") ||
    text.includes("parliament")
  ) {
    return "Politics"
  }

  if (
    text.includes("war") ||
    text.includes("conflict") ||
    text.includes("military") ||
    text.includes("china") ||
    text.includes("iran") ||
    text.includes("russia")
  ) {
    return "World"
  }

  return "General"
}

module.exports = classifyTopic