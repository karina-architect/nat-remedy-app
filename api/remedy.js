import OpenAI from "openai";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const { issue, details } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful natural remedy expert.",
        },
        {
          role: "user",
          content: `Give a natural remedy for ${issue}. Details: ${details}`,
        },
      ],
    });

    const text = completion.choices[0].message.content;

    return res.status(200).json({
      title: `${issue} Remedy`,
      summary: text,
      ingredients: ["Natural ingredients"],
      steps: [text],
      benefits: ["Natural relief"],
      prepTime: "5 min",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
}
