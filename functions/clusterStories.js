const extractKeywords = require("./extractKeywords")
const extractEntities = require("./extractEntities")

function shareSignal(a,b){

  const ea = extractEntities(a.title)
  const eb = extractEntities(b.title)

  const entityMatch = ea.some(e => eb.includes(e))

  if(entityMatch) return true

  const ka = extractKeywords(a.title)
  const kb = extractKeywords(b.title)

  let overlap = 0

  for(const k of ka){
    if(kb.includes(k)) overlap++
  }

  return overlap >= 2
}

function clusterStories(articles){

  const clusters = []

  for(const article of articles){

    let matchedCluster = null

    for(const cluster of clusters){

      // IMPORTANT: match only cluster center
      const center = cluster.center

      if(shareSignal(article, center)){

        matchedCluster = cluster
        break

      }

    }

    if(matchedCluster){

      matchedCluster.articles.push(article)

    }else{

      clusters.push({
        center: article,
        articles: [article]
      })

    }

  }

  return clusters.map(cluster => {

    const sorted = cluster.articles.sort(
      (a,b) => (b.importance||0)-(a.importance||0)
    )

    const main = sorted[0]

    return {
      title: main.title,
      url: main.url,
      source: main.source,
      published: main.published,
      topic: main.topic,
      importance: main.importance,
      clusterArticles: sorted
    }

  })

}

module.exports = clusterStories