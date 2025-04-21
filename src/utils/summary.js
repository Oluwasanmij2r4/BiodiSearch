export const generateSpeciesSummary = (species) => {
  if (!species) return "";
  const {
    scientificName,
    commonName,
    kingdom,
    family,
    occurrenceCount,
    statusName,
    extinct,
  } = species;

  let summary = `${scientificName} (${commonName}) is a species in the kingdom ${kingdom}, classified under the family ${family}.`;

  if (extinct) {
    summary += ` This species is believed to be extinct.`;
  } else {
    summary += ` It is currently listed as ${statusName.toUpperCase()}, with over ${occurrenceCount.toLocaleString()} recorded occurrences.`;
  }

  return summary;
};

// According to the 2023 assessment by the IUCN Red List, Panthera leo (lion) is categorized as Vulnerable, having met the A2abcd criteria for population decline and habitat threat.

export const abstractSummary = (species) => {
  if (!species) return "";
  const {
    scientificName,
    commonName,
    statusName,
    occurrenceCount,
    kingdom,
    extinct,
  } = species;

  if(kingdom === "Animalia") {
    let summary = `According to the assessment by the IUCN Red List, ${scientificName} (${commonName}) is categorized as ${statusName}`;
      if (extinct) {
        summary += ` This species is believed to be extinct.`;
      } else {
        summary += ` It is currently listed as ${statusName.toUpperCase()}, with over ${occurrenceCount.toLocaleString()} recorded occurrences.`;
      }
       return summary;
  }
  return "";
 
};

