const axios = require("axios");

async function aiClassify(articles){

  const titles = articles.map(a => a.title);

  const prompt = `
Classify each headline into one topic from this list:

AI
Technology
Business & Startups
Markets & Crypto
Geopolitics
Energy
Climate
Science
General

Return ONLY JSON like:
[
{"title":"headline text","topic":"Technology"}
]

Headlines:
${titles.join("\n")}
`;

  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model:"gpt-4.1-mini",
      messages:[
        {role:"user",content:prompt}
      ],
      temperature:0
    },
    {
      headers:{
        "Authorization":`Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type":"application/json"
      }
    }
  );

  return JSON.parse(response.data.choices[0].message.content);

}

module.exports = aiClassify;