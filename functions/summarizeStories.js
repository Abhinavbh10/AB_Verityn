
const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function summarizeStories(stories) {

  const results = [];

  for (const story of stories) {

    const sources = (story.clusterArticles || [])
      .map(a => `
Source: ${a.source}
Title: ${a.title}
Snippet: ${a.description || ""}
`)
      .join("\n");

    const prompt = `
You are a professional news editor.

Write a TWO sentence summary of this news story.

Rules:
Sentence 1 → describe the event with concrete facts.
Sentence 2 → explain the consequence or reaction.

Do NOT repeat the headline.
Do NOT use vague phrases like:
"raises concerns", "signals", "highlights tensions".

Story sources:
${sources}

Return ONLY the summary text as two sentences.
`;

    try {

      const response = await client.chat.completions.create({
        model: "gpt-4.1-mini",
        temperature: 0,
        messages: [{ role: "user", content: prompt }]
      });

      const text = response.choices[0].message.content.trim();

      const sentences = text.split(". ").slice(0,2).map(s => s.trim());

      results.push({
        ...story,
        summary: sentences
      });

    } catch (err) {

      console.log("AI summarization error:", err.message);

      results.push({
        ...story,
        summary: ["Summary unavailable", "AI processing failed"]
      });

    }

  }

  return results;

}

module.exports = summarizeStories;