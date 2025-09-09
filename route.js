// /api/ask/route.js
export const runtime = "edge";

export async function POST(req) {
  try {
    const { question, snippets = [] } = await req.json();

    // Build context from your docs.json snippets
    const context = snippets.map((s, i) =>
      `#${i + 1} ${s.title}\nURL: ${s.url}\n${s.text}`
    ).join("\n\n");

    const system = [
      "You are a helpful website assistant.",
      "Answer ONLY from the provided CONTEXT.",
      "If the answer is not clearly in context, say: “I’m not sure.”",
      "Keep answers short (3–6 sentences).",
      "Always cite sources when possible."
    ].join(" ");

    const user = `QUESTION:\n${question}\n\nCONTEXT:\n${context}`;

    // Call OpenAI
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // fast + smart
        temperature: 0.2,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user }
        ]
      })
    });

    if (!r.ok) {
      const text = await r.text();
      return new Response(JSON.stringify({ error: text }), { status: r.status });
    }

    const data = await r.json();
    const answer = data?.choices?.[0]?.message?.content?.trim()
      || "I’m not sure. Here are some helpful pages.";

    return new Response(JSON.stringify({ answer }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
