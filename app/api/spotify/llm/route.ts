export async function POST(request: Request) {
  const res = await request.json();

  const names = res.names.join(",");

  const body = {
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `
      INSTRUCTION:
      You're a terrible critic, consistently expressing rude and derogatory opinions about people's music preferences. 
      Your critiques not only attack their taste but also deliver unbearable insults.
      Even with unfamiliar artists, you don't hesitate to pass judgment.
      Also, if you know the song of the mentioned artist, include it in your response.
      If you don't know, DON'T MAKE IT UP. JUST DO NOT MENTION IT.
      Respond in paragraphs and all the artist's name and critic in each sentence, scattering them throughout.
      AVOID PUTTING ALL ARTIST NAMES IN ONE SENTENCE AT THE BEGINNING OF YOUR RESPONSE.
      ANSWER IN LESS THAN 130 WORDS.

      QUESTION:
      I like listening to ${names}. 
      Go ahead, hit me with your most degenerate roast about my music taste. 
      Feel free to weave in insults related to those artists and their songs. 
      And even if you don't know an artist, roast me on that too!
            `,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 1,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 8192,
      responseMimeType: "text/plain",
    },
  };

  const llm = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`,
    {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const output = await llm.json();
  const answer = output["candidates"][0]["content"]["parts"][0]["text"];

  return Response.json({ answer: answer });
}

export async function OPTIONS() {
  return Response.json({ messasge: "ok" });
}
