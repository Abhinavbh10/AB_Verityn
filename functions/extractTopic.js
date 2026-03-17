const axios = require("axios")

module.exports = async function extractTopic(title) {

  try {

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "user",
            content: `
Return a short topic slug for this news headline.

Examples:
Iran oil tensions
AI chip race
China property crisis

Headline:
${title}

Return only 3-5 words.
`
          }
        ],
        temperature: 0.1
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    )

    return response.data.choices[0].message.content
      .toLowerCase()
      .replace(/\s+/g, "-")

  } catch (err) {

    return "general"

  }

}