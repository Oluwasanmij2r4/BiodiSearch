// src/utils/queryParser.js

const knownKingdoms = {
  plants: "Plantae",
  animals: "Animalia",
  fungi: "Fungi",
  birds: "Aves",
  mammals: "Mammalia",
  reptiles: "Reptilia",
  amphibians: "Amphibia",
  insects: "Insecta",
};

export function parseQueryFilters(query) {
  const lowerQuery = query.toLowerCase();
  let kingdom = null;
  let country = null;

  for (const [keyword, value] of Object.entries(knownKingdoms)) {
    if (lowerQuery.includes(keyword)) {
      kingdom = value;
      break;
    }
  }

  const countryMatch = lowerQuery.match(/\bin\s+([a-zA-Z\s]+)$/);
  if (countryMatch) {
    country = countryMatch[1].trim();
  }

  return { kingdom, country };
}
