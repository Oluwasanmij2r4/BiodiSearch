export const fetchSpeciesFromGBIF = async (scientificName) => {
  try {
    const res = await fetch(
      `https://api.gbif.org/v1/species/match?name=${encodeURIComponent(
        scientificName
      )}`
    );
    const species = await res.json();

    if (!species || !species.usageKey) {
      return null;
    }

    return {
      taxonKey: species.usageKey, 
      scientificName: species.scientificName,
      rank: species.rank,
      kingdom: species.kingdom,
      phylum: species.phylum,
      order: species.order,
      family: species.family,
      genus: species.genus,
      gbifLink: `https://www.gbif.org/species/${species.usageKey}`,
    };
  } catch (error) {
    console.error("Error fetching species from GBIF:", error);
    return null;
  }
};

export const fetchOccurrenceCount = async (taxonKey) => {
  try {
    const res = await fetch(
      `https://api.gbif.org/v1/occurrence/search?taxon_key=${taxonKey}&limit=0`
    );
    const data = await res.json();

    return data.count || 0;
  } catch (error) {
    console.error("Error fetching occurrence count:", error);
    return 0;
  }
};
