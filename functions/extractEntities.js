const BLOCK_ENTITIES = new Set([
  "US","USA","UK","EU",
  "State","States","Government",
  "World","Global","Market","Markets",
  "Breaking","Report","Reports","News",
  "Live","Update","Updates"
])

function extractEntities(title){

  if(!title) return []

  const words = title.split(" ")

  return words
    .map(w => w.replace(/[^\w]/g,""))
    .filter(w => {

      if(w.length < 3) return false

      if(BLOCK_ENTITIES.has(w)) return false

      if(w === w.toUpperCase() && w.length <= 5) return true

      return /^[A-Z][a-z]+$/.test(w)

    })

}

module.exports = extractEntities