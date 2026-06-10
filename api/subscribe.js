const { Redis } = require("@upstash/redis");

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN
});

module.exports = async (req, res) => {
  if (req.method !== "POST") { res.status(405).json({ error: "Method not allowed" }); return; }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const { subscription } = body;
    if (!subscription) { res.status(400).json({ error: "Missing subscription" }); return; }

    await redis.set("push:subscription", JSON.stringify(subscription));
    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to save subscription" });
  }
};
