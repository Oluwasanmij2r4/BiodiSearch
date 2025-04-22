
export const generateGbifCitation = (speciesName, gbifUrl) => {
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return `GBIF.org (${today.getFullYear()}). Species search result for "${speciesName}". ${gbifUrl} [Accessed: ${formattedDate}]`;
};
