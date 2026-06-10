// api/judge.js
// This runs on Vercel's server (never in the browser), so your API key stays private.
// It receives a word + a sentence, asks Claude Haiku to judge it, and sends back a verdict.

async function readBody(req) {
  if (req.body !== undefined && req.body !== null) {
    return typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body;
  }
  return await new Promise((resolve) => {
    let data = "";
    req.on("data", (c) => (data += c));
    req.on("end", () => { try { resolve(JSON.parse(data || "{}")); } catch { resolve({}); } });
  });
}

module.exports = async (req, res) => {
  if (req.method !== "POST") { res.status(405).json({ error: "Method not allowed" }); return; }

  try {
    const { word, definition, sentence } = await readBody(req);
    if (!word || !sentence) { res.status(400).json({ error: "Missing word or sentence" }); return; }

    const system =
      `You are a warm, encouraging vocabulary tutor. Decide whether the user used the target word ` +
      `correctly and meaningfully in their own sentence. The word is "${word}"` +
      (definition ? ` (meaning: ${definition})` : "") +
      `. Count it correct if the sentence uses the word in a way that fits its real meaning. ` +
      `Allow any grammatical form of the word, and ignore minor spelling or punctuation slips. ` +
      `Reply with ONLY a JSON object and nothing else, exactly like {"correct": true, "feedback": "..."}. ` +
      `If correct, congratulate warmly in one short sentence. If incorrect, gently explain what's off and ` +
      `give a small hint — but do NOT write a correct example sentence for them. Keep feedback under 40 words.`;

    const apiRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001", // cheapest current model; plenty smart for this
        max_tokens: 300,
        system,
        messages: [{ role: "user", content: `Sentence: ${sentence}` }]
      })
    });

    const data = await apiRes.json();
    const text = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("").trim();

    let verdict;
    try { verdict = JSON.parse(text.replace(/```json|```/g, "").trim()); }
    catch { verdict = { correct: false, feedback: "I couldn't read the judgment clearly — please try again." }; }

    res.status(200).json(verdict);
  } catch (err) {
    res.status(500).json({ correct: false, feedback: "Something went wrong reaching the judge. Please try again." });
  }
};
