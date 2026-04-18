import OpenAI from "openai";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    // 🔑 Check API key
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: "Missing OpenAI API key" });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const { issue, details } = req.body;

    if (!issue) {
      return res.status(400).json({ error: "Missing issue" });
    }

    // ✅ NEW STABLE API
    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input: `Give a simple natural home remedy for: ${issue}. Details: ${details}`,
    });

    const text =
      response.output?.[0]?.content?.[0]?.text ||
      "Natural remedy could not be generated.";

    return res.status(200).json({
      title: `${issue} Remedy`,
      summary: text,
      ingredients: ["Natural ingredients"],
      steps: [text],
      benefits: ["Natural relief"],
      prepTime: "5 min",
    });

  } catch (error) {
    console.error("FULL ERROR:", error);

    return res.status(500).json({
      error: error.message || "Server error",
    });
  }
}
