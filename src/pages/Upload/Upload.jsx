import React, { useState } from "react";
import { generateSpeciesSummary } from "../../utils/summary"; // Import your template summary
import { fetchAiSummary } from "../../api/ai"; // Import the AI summary function

const dummySpecies = {
  scientificName: "Panthera leo",
  commonName: "Lion",
  kingdom: "Animalia",
  family: "Felidae",
  occurrenceCount: 14504,
  status: "Vulnerable",
};

const TestAISummary = () => {
  const [expanded, setExpanded] = useState(false);
  const [aiSummary, setAiSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleReadMore = async () => {
    const cached = localStorage.getItem(
      `ai-summary-${dummySpecies.scientificName}`
    );
    if (cached) {
      setAiSummary(cached);
      setExpanded(true);
      return;
    }

    setLoading(true);
    const result = await fetchAiSummary(dummySpecies);
    setLoading(false);

    if (result) {
      localStorage.setItem(`ai-summary-${dummySpecies.scientificName}`, result);
      setAiSummary(result);
      setExpanded(true);
    }
  };

  return (
    <div>
      <h1>Test AI Summary for {dummySpecies.commonName}</h1>
      <p>{generateSpeciesSummary(dummySpecies)}</p>

      {!expanded && (
        <button onClick={handleReadMore} disabled={loading}>
          {loading ? "Loading..." : "Read More"}
        </button>
      )}

      {expanded && aiSummary && (
        <div>
          <h2>AI Generated Summary:</h2>
          <p>{aiSummary}</p>
        </div>
      )}
    </div>
  );
};

export default TestAISummary;
