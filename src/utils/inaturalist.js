// utils/inaturalist.js

export const resolveScientificName = async (query) => {
  const url = `https://api.inaturalist.org/v1/search?q=${encodeURIComponent(
    query
  )}&sources=taxa`;
  try {
    const res = await fetch(url);
    const data = await res.json();

    const firstTaxon = data.results.find((result) => result.type === "Taxon");
    if (firstTaxon && firstTaxon.record && firstTaxon.record.name) {
      return firstTaxon.record.name; // e.g. "Panthera leo"
    }

    return null;
  } catch (error) {
    console.error("Error resolving name from iNaturalist:", error);
    return null;
  }
};
