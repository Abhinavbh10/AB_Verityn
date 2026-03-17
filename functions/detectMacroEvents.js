module.exports = function detectMacroEvents(stories) {

  const events = [
    {
      name: "iran-conflict",
      keywords: ["iran", "tehran", "hormuz", "us military", "iranian"]
    },
    {
      name: "ai-race",
      keywords: ["ai", "artificial intelligence", "openai", "model", "llm", "chip"]
    },
    {
      name: "china-economy",
      keywords: ["china", "beijing", "yuan", "chinese economy"]
    },
    {
      name: "russia-war",
      keywords: ["russia", "ukraine", "putin", "nato"]
    },
    {
      name: "energy-markets",
      keywords: ["oil", "gas", "energy", "opec", "barrel"]
    }
  ]

  const macroEvents = []

  for (const event of events) {

    const matchedStories = stories.filter(story => {

      const title = (story.title || "").toLowerCase()

      return event.keywords.some(keyword =>
        title.includes(keyword)
      )

    })

    if (matchedStories.length >= 2) {

      macroEvents.push({
        event: event.name,
        stories: matchedStories.slice(0, 4)
      })

    }

  }

  return macroEvents

}