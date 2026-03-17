const STOPWORDS = new Set([
  "the","a","an","in","on","at","to","for","of","and","with",
  "amid","after","over","says","report","reports","according",
  "update","live","video","latest","breaking"
])

function extractKeywords(title) {

  if (!title) return []

  return title
    .toLowerCase()
    .replace(/[^\w\s]/g,"")
    .split(" ")
    .filter(w =>
      w.length > 4 && !STOPWORDS.has(w)
    )

}

module.exports = extractKeywords