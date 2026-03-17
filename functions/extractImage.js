const axios = require("axios")
const cheerio = require("cheerio")

async function extractImage(url) {

  try {

    const res = await axios.get(url, {
      timeout: 5000,
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    })

    const $ = cheerio.load(res.data)

    const ogImage = $('meta[property="og:image"]').attr("content")

    if (ogImage) return ogImage

    const twitterImage = $('meta[name="twitter:image"]').attr("content")

    if (twitterImage) return twitterImage

    return null

  } catch (err) {

    return null

  }

}

module.exports = extractImage