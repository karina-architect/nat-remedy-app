import OpenAI from "openai";

export default async function handler(req, res) {
  try {
    // Only allow POST
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const { issue, details } = req.body;

    if (!issue) {
      return res.status(400).json({ error: "Missing issue" });
    }

    const prompt = `
You are a natural remedy expert.

Provide a SAFE, SIMPLE, HOME remedy for the following condition.

Condition: ${issue}
Details: ${details || "none"}

Return response in this JSON format:
{
  "title": "...",
  "summary": "...",
  "ingredients": ["..."],
  "steps": ["..."],
  "benefits": ["..."],
  "prepTime": "..."
}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful natural remedy expert." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    });

    let text = response.choices[0].message.content;

    // Try to parse JSON safely
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      parsed = {
        title: `${issue} Remedy`,
        summary: text,
        ingredients: ["Natural ingredients"],
        steps: [text],
        benefits: ["Natural relief"],
        prepTime: "5 min",
      };
    }

    return res.status(200).json(parsed);

  } catch (error) {
    console.error("API ERROR:", error);
    return res.status(500).json({
      error: "Something went wrong",
    });
  }
}
