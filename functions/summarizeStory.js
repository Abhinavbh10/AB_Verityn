const axios = require("axios")

async function summarizeStory(title) {

  try {

    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      throw new Error("OPENAI_API_KEY missing")
    }

    const response = await axios.post(
      "https://api.openai.com/v1/responses",
      {
        model: "gpt-4.1-mini",
        input: `Summarize this news headline in two short bullet points. 
First bullet: key fact.
Second bullet: why it matters.

Headline: ${title}`
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        }
      }
    )

    const text = response.data.output[0].content[0].text

    const bullets = text
      .split("\n")
      .map(s => s.replace(/^[-•]\s*/, "").trim())
      .filter(Boolean)
      .slice(0, 2)

    return bullets

  } catch (error) {

    console.log("AI summarization error:", error.message)

    return [
      "Summary unavailable",
      "AI processing failed"
    ]

  }

}

module.exports = summarizeStory