export const fetchAiSummary = async( species) =>{
    const {
        scientificName,
        commonName,
        kingdom,
        family,
        status,
        occurrenceCount,
} = species;

const prompt = `Write a short 2–3 sentence educational summary for high school students about this species:
- Scientific Name: ${scientificName}
- Common Name: ${commonName}
- Kingdom: ${kingdom}
- Family: ${family}
- Status: ${status}
- Occurrence Count: ${occurrenceCount}
`;

try {
  // Completion (POST /completions)
  const res = await fetch("https://openrouter.ai/api/v1/completions", {
    method: "POST",
    headers: {
      Authorization:
        "Bearer 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",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "nvidia/llama-3.1-nemotron-nano-8b-v1:free",
      prompt: `${prompt}`,
    }),
  });


  const data = await res.json();
  const replyText = data?.choices?.[0]?.text
  return replyText;
} catch(err) {
        console.error('AI Sumarry error', err);
        return null;
    }
};