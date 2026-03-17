function buildTimeline(clusterArticles = []) {

  if (!clusterArticles || clusterArticles.length === 0) return []

  const timeline = clusterArticles
    .slice() // copy array
    .sort((a,b) => {

      const ta = new Date(a.published || 0).getTime()
      const tb = new Date(b.published || 0).getTime()

      return ta - tb

    })
    .slice(0,10) // keep timeline manageable
    .map(a => ({
      title: a.title,
      source: a.source,
      published: a.published,
      url: a.url
    }))

  return timeline
}

module.exports = buildTimeline