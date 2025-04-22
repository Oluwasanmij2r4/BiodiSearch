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



const getImageBase64 = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = function () {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL("image/jpeg");
      resolve(dataURL);
    };
    img.onerror = reject;
    img.src = url;
  });
};

export const reportToPdf = async (speciesData, aiSummary) => {
  const doc = new jsPDF();
  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);

  let y = 10;

  doc.setFontSize(18);
  doc.text("Species Research Report", 10, y);
  y += 15;

  for (const [index, species] of speciesData.entries()) {
    doc.setFontSize(16);
    doc.text(
      `${index + 1}. ${species.commonName} (${species.scientificName})`,
      10,
      y
    );
    y += 10;

    // Try to add image if available
    if (species.imageUrl) {
      try {
        const base64Image = await getImageBase64(species.imageUrl);
        doc.addImage(base64Image, "JPEG", 10, y, 40, 30); // Adjust size if needed
        y += 35;
      } catch (error) {
        doc.setFontSize(12);
        doc.text("Image failed to load.", 10, y);
        y += 10;
      }
    }

    // Text fields
    doc.setFontSize(12);
    doc.text(`Occurrence Count: ${species.occurrenceCount}`, 10, y);
    y += 6;
    doc.text(`Status: ${species.statusName}`, 10, y);
    y += 6;
    doc.text(`Authority: ${species.authority}`, 10, y);
    y += 6;
    doc.text(`Kingdom: ${species.kingdom}`, 10, y);
    doc.text(`Phylum: ${species.phylum}`, 60, y);
    y += 6;
    doc.text(`Class: ${species.class}`, 10, y);
    doc.text(`Order: ${species.order}`, 60, y);
    y += 6;
    doc.text(`Family: ${species.family}`, 10, y);
    doc.text(`Genus: ${species.genus}`, 60, y);
    y += 10;

    // Abstract Summary
    doc.text("Abstract Summary:", 10, y);
    y += 6;
    const wrappedAbstract = doc.splitTextToSize(
      species.abstract || "No abstract available.",
      180
    );
    doc.text(wrappedAbstract, 10, y);
    y += wrappedAbstract.length * 6;

    // AI Summary
    doc.text("AI Summary:", 10, y);
    y += 6;

    if (aiSummary) {
      const wrappedSummary = doc.splitTextToSize(aiSummary, 180);
      doc.text(wrappedSummary, 10, y);
      y += wrappedSummary.length * 6;
    } else {
      doc.text(
        "Not available. Run AI summary to include it in the report.",
        10,
        y
      );
      y += 10;
    }

    // Add separator line
    doc.setLineWidth(0.5);
    doc.line(10, y, 200, y);
    y += 10;
  }

  // Footer
  doc.setFontSize(10);
  const date = new Date().toLocaleDateString("en-US");
  doc.text(`Report generated on ${date}`, 10, y);
  y += 6;
  doc.text("Citation: Generated using GBIF and iNaturalist data", 10, y);

  doc.save("species_report.pdf");
};
