const { onRequest } = require("firebase-functions/v2/https")

const generateBrief = require("./generateBrief")

exports.generateNow = onRequest(
  {
    cors: true,
    timeoutSeconds: 60,
    memory: "512MiB",
  },
  async (req, res) => {
    try {
      console.log("Generating brief...")

      const result = await generateBrief()

      res.status(200).json(result)
    } catch (error) {
      console.error("generateNow error:", error)

      res.status(500).json({
        error: "generateBrief failed",
        details: error.message,
      })
    }
  }
)