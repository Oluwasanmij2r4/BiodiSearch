
export const fetchFromINaturalist = async (query) => {
  try {
    const res = await fetch(
      `https://api.inaturalist.org/v1/search?q=${encodeURIComponent(
        query
      )}&sources=taxa`
    );
    const data = await res.json();

    if (data.results.length === 0 || !data.results[0].record) {
      return null;
    }

    const record = data.results[0].record;

    return {
      scientificName: record.name,
      commonName: record.preferred_common_name
        ? record.preferred_common_name.charAt(0).toUpperCase() +
          record.preferred_common_name.slice(1)
        : query.charAt(0).toUpperCase() + query.slice(1),
      imageUrl: record.default_photo?.medium_url || null,
      extinct: record.extinct ?? "Unknown",
    };
  } catch (error) {
    console.error("Error fetching from iNaturalist:", error);
    return null;
  }
};


export const fetchConservationStatus = async (query) => {
  try {
    const res = await fetch(`https://api.inaturalist.org/v1/search?q=${query}`);
    const data = await res.json();

    const speciesId = data?.results?.[0]?.record?.id

    const response = await fetch(`https://api.inaturalist.org/v1/taxa/${speciesId}`);

    const speciesIdData= await response.json();

    const conservationStatus = speciesIdData?.results?.[0]?.taxon_photos?.[0]?.taxon?.conservation_status

   if (conservationStatus) {
      return {
        authority: conservationStatus.authority || "Unknown",
        statusName: conservationStatus.status_name || "Unknown",
      }; 
    } else {
      return {
        authority: "Unknown",
        statusName: "Not Evaluated",
      };

    }

 
  } catch (error) {
    console.error("Error fetching conservation status:", error);
    return null;
  }
};