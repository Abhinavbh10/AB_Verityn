const axios = require("axios")
const cheerio = require("cheerio")

async function fetchArticleText(url) {

  try {

    const res = await axios.get(url, {
      timeout: 5000,
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    })

    const html = res.data
    const $ = cheerio.load(html)

    let text = ""

    $("p").each((i, el) => {
      text += $(el).text() + " "
    })

    text = text.replace(/\s+/g, " ").trim()

    return text.slice(0, 600)

  } catch (err) {

    return ""

  }

}

module.exports = fetchArticleText