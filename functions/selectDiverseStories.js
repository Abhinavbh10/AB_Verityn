function selectDiverseStories(clusters, limit = 12) {

  if (!clusters || clusters.length === 0) return [];

  // Normalize cluster format
  const normalized = clusters.map(cluster => {

    const articles = Array.isArray(cluster)
      ? cluster
      : cluster.clusterArticles || cluster.articles || [];

    if (!articles.length) return null;

    const primary = articles[0];

    return {
      title: primary.title,
      url: primary.url,
      source: primary.source,
      published: primary.published,
      topic: primary.topic,
      importance: primary.importance || 0,

      // keep full cluster internally
      clusterArticles: articles
    };

  }).filter(Boolean);

  // Score clusters
  normalized.sort((a, b) => {

    const scoreA =
      (a.importance || 0) +
      (a.clusterArticles?.length || 0);

    const scoreB =
      (b.importance || 0) +
      (b.clusterArticles?.length || 0);

    return scoreB - scoreA;

  });

  // Select top clusters
  const stories = normalized.slice(0, limit).map(cluster => ({

    title: cluster.title,
    url: cluster.url,
    source: cluster.source,
    published: cluster.published,
    topic: cluster.topic,
    importance: cluster.importance,

    // keep only a few for summarization
    clusterArticles: cluster.clusterArticles.slice(0, 10)

  }));

  return stories;
}

module.exports = selectDiverseStories;