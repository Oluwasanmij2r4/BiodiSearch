import { countryNameToCode } from "../utils/countryCode";
import { resolveScientificName } from "../utils/inaturalist";


const BASE_URL = "https://api.gbif.org/v1";

// Search for species using the GBIF API
export const fetchSpecies = async ({taxon, country, q, originalQuery}) => {
  const params = new URLSearchParams();

  let searchQuery = q?.trim();

    if (searchQuery && !taxon && !country) {
      const resolved = await resolveScientificName(searchQuery);
      if (resolved) {
        searchQuery = resolved;
      }
    } else if ((!searchQuery || searchQuery === "") && originalQuery) {
      const resolved = await resolveScientificName(originalQuery);
      if (resolved) {
        searchQuery = resolved;
      }
    }

   if (searchQuery) {
     params.append("q", searchQuery);
   }

  if (taxon?.kingdom) {
    params.append("kingdom", taxon.kingdom);
  }
  if (taxon?.class) {
    params.append("class", taxon.class);
  }

  if (country) {
    const code = countryNameToCode[country.toLowerCase()];
    if (code) {
      params.append("country", code);
    }
  }

  params.append("limit", "8");

  const url = `${BASE_URL}/species/search?${params.toString()}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data.results || [];
  } catch (err) {
    console.error("Error fetching species from GBIF:", err);
    return [];
  }
}