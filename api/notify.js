const webpush = require("web-push");
const { Redis } = require("@upstash/redis");

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN
});

module.exports = async (req, res) => {
  try {
    webpush.setVapidDetails(
      process.env.VAPID_SUBJECT,
      process.env.VAPID_PUBLIC_KEY,
      process.env.VAPID_PRIVATE_KEY
    );

    const raw = await redis.get("push:subscription");
    const subscription = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (!subscription) return res.status(200).json({ sent: false, reason: "no subscription" });

    const type = req.query.type || "morning";

    if (type === "evening") {
      const lastVisit = await redis.get("push:lastVisit");
      const today = new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" });
      if (lastVisit === today) return res.status(200).json({ sent: false, reason: "already visited today" });
    }

    const messages = {
      morning: { title: "Sami's Daily Word", body: "Good morning! A new word is waiting just for you \u2600\uFE0F" },
      evening: { title: "Sami's Daily Word", body: "Your word of the day is still waiting! Don't break your streak \uD83D\uDD25" }
    };

    const payload = JSON.stringify(messages[type] || messages.morning);
    await webpush.sendNotification(subscription, payload);
    res.status(200).json({ sent: true, type });
  } catch (err) {
    res.status(500).json({ sent: false, error: err.message });
  }
};
