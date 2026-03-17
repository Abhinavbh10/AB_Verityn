function bucketByTopic(articles) {

  const buckets = {}

  for (const article of articles) {

    const topic = article.topic || "General"

    if (!buckets[topic]) {
      buckets[topic] = []
    }

    buckets[topic].push(article)

  }

  return buckets

}

module.exports = bucketByTopic