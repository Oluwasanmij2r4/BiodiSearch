export const generateSpeciesSummary = (species) => {
  const {
    scientificName,
    commonName,
    kingdom,
    family,
    occurrenceCount,
    status,
    extinct,
  } = species;

  let summary = `${scientificName} (${commonName}) is a species in the kingdom ${kingdom}, classified under the family ${family}.`;

  if (extinct) {
    summary += ` This species is believed to be extinct.`;
  } else {
    summary += ` It is currently listed as ${status.toUpperCase()}, with over ${occurrenceCount.toLocaleString()} recorded occurrences.`;
  }

  return summary;
};
