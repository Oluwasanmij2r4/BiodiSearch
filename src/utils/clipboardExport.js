export const exportToClipboard = (speciesList) => {
  const text = speciesList
    .map(
      (species, index) =>
        `${index + 1}. ${species.commonName} (${
          species.scientificName
        })\nNote: ${species.note || "No notes"}\n`
    )
    .join("\n");

  navigator.clipboard
    .writeText(text)
    .then(() => alert("✅ Species list copied to clipboard!"))
    .catch(() => alert("❌ Failed to copy to clipboard."));
};
