function normalizeHeadline(title){

return title
.toLowerCase()
.replace(/[^a-z0-9\s]/g,"")
.split(" ")
.filter(word => word.length > 3)
.join(" ");

}

module.exports = normalizeHeadline;