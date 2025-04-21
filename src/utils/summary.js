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


export const applyStylesToSummary = (summary, species) => {
  const { commonName, scientificName } = species;

  // Replace the common name with a class name
  summary = summary.replace(
    new RegExp(`(${commonName})`, "gi"), // Match the common name in the summary
    `<span class="summaryText">$1</span>`
  );

  // Replace the scientific name with a class name
  summary = summary.replace(
    new RegExp(`(${scientificName})`, "gi"), // Match the scientific name in the summary
    `<span class="summaryText">$1</span>`
  );

  return summary;
};
