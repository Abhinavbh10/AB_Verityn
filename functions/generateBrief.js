const axios = require("axios")

// ⚠️ Make sure you set this in Firebase env later
const OPENAI_API_KEY = process.env.OPENAI_API_KEY

async function callLLM(clusterArticles) {
  const titles = clusterArticles.map(a => a.title).join("\n")

  const prompt = `
You are an expert news analyst.

Given these articles, produce:

1. A concise summary (2 lines max)
2. A "why it matters" insight (ONE sharp line explaining impact)

Rules:
- Do NOT repeat headlines
- Focus on meaning, impact, consequence
- No generic phrases

Return JSON:
{
  "summary": "...",
  "whyItMatters": "..."
}

Articles:
${titles}
`

  const res = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.4,
    },
    {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
    }
  )

  try {
    const text = res.data.choices[0].message.content
    return JSON.parse(text)
  } catch (e) {
    return {
      summary: clusterArticles[0].title,
      whyItMatters: "Developing situation with potential broader impact",
    }
  }
}

module.exports = async function generateBrief() {
  // 👉 STEP 1: Fetch RSS (you already have this, keep yours if better)
  const rss = await axios.get(
    "https://feeds.bbci.co.uk/news/world/rss.xml"
  )

  const items = rss.data.match(/<item>(.*?)<\/item>/gs) || []

  const articles = items.slice(0, 20).map(item => {
    const title = item.match(/<title>(.*?)<\/title>/)?.[1] || ""
    const link = item.match(/<link>(.*?)<\/link>/)?.[1] || ""

    return {
      title,
      url: link,
      source: "BBC",
      topic: "World",
      image: null,
    }
  })

  // 👉 STEP 2: Naive clustering (we’ll fix later)
  const clusters = articles.map(a => [a])

  // 👉 STEP 3: Generate briefs
  const stories = []

  for (const cluster of clusters.slice(0, 10)) {
    const ai = await callLLM(cluster)

    stories.push({
      title: cluster[0].title,
      summary: ai.summary,
      whyItMatters: ai.whyItMatters,
      source: cluster[0].source,
      image: cluster[0].image,
      timeline: cluster,
    })
  }

  return {
    stories,
  }
}