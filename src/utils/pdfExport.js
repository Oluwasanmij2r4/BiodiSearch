import jsPDF from "jspdf";

export const exportToPdf = (speciesList) => {
  const doc = new jsPDF();
  let y = 10;

  speciesList.forEach((species, index) => {
    doc.text(
      `${index + 1}. ${species.commonName} (${species.scientificName})`,
      10,
      y
    );
    y += 6;
    doc.text(`Note: ${species.note || "No notes"}`, 10, y);
    y += 10;
  });

  doc.save("my_species_list.pdf");
};
