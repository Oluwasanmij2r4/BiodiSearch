// utils/parseQuery.js

// Map common keywords to GBIF kingdom keys or taxon keys
const taxonMap = {
  plants: { kingdom: "Plantae" },
  fungi: { kingdom: "Fungi" },
  birds: { class: "Aves" },
  mammals: { class: "Mammalia" },
  insects: { class: "Insecta" },
  reptiles: { class: "Reptilia" },
  amphibians: { class: "Amphibia" },
  fish: { class: "Actinopterygii" },
};

export const parseQuery = (query) => {
  const lower = query.toLowerCase();
  const result = {
    taxon: null,
    country: null,
    endemic: false,
    q: null,
  };

  // Detect endemic keyword
  if (lower.includes("endemic")) {
    result.endemic = true;
  }

  // Detect taxon keyword
  for (const key in taxonMap) {
    if (lower.includes(key)) {
      result.taxon = taxonMap[key];
      break;
    }
  }

  // Detect country (basic match, can be improved with a full country list)
  const countryRegex = /in\s([a-z\s]+)/i;
  const match = query.match(countryRegex);
  if (match && match[1]) {
    result.country = match[1].trim();
  }

  if (!result.taxon && !result.country) {
    result.q = query.trim(); // Free text search fallback
  }

  return result;
};


