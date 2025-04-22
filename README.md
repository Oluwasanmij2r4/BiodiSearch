# EcoScholar || 🌿 Biodiversity Research Assistant

![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/built%20with-React-61DAFB)
![Styled with](https://img.shields.io/badge/styled%20with-CSS%20Modules-blue)
![Map](https://img.shields.io/badge/maps%20via-Leaflet-199900)
![PDF](https://img.shields.io/badge/exports%20PDF-jsPDF-yellow)

Welcome to the Biodiversity Research Assistant, a lightweight, browser-based web app built for students, researchers, and nature enthusiasts. This tool helps users explore species data in a visual, summarized, and citation-ready format — all without requiring an account or backend server.

- - -

## 🧠 Key Features

**✏️ Auto-Summary Generator**
The app includes an automatic summary feature that condenses scientific data into a 2–3 sentence paragraph. It highlights a species’ traits, classification, and global distribution in easy-to-understand language. This feature is ideal for students who need quick notes or short descriptions in their research papers.

**📌 Research Workspace ("My Species List")**
Users can save species they are studying to a personal list, and take notes directly in the browser. For example:

“Used this for my climate change presentation.”
All notes and saved data persist using localStorage, with zero login required. Once ready, users can export everything — including summaries and images — into a downloadable PDF.

**📚 Citation Generator**
Scientific data must be credited properly. This app automatically generates formatted citations from GBIF and iNaturalist sources.

**🌍 Distribution Map**
Each species comes with an interactive Leaflet.js map displaying global observation data pulled from the GBIF Occurrence API. This visualization gives researchers a better understanding of where species are found across the globe.


## 🔎 How It Works

**1. Search by Species Name**
- Users can enter either a common name (e.g., “lion”) or a scientific name (e.g., Panthera leo).
- If a common name is entered, the app uses the iNaturalist API to resolve it to a scientific name and fetch an image.
- It then uses the GBIF API to fetch structured data like classification, observation count, and more.

**2. Display Results**
- Each result card includes: 🖼 Species image || 🧬 Scientific and common names ||🧪 Taxonomic hierarchy || 🌍 GBIF observation count || 🔗 Link to the GBIF species page
- Users can then choose to save the species to their personal research list.

**3. 📄 PDF Report Generator**
- One of the app’s highlights is the PDF export feature. A single click will create a polished report with:
- A cover title
- Each species' name, image, and core metadata
- Abstract summary and AI-generated summary (if available)

- This is especially useful for submitting quick field reports, adding to study material, or attaching to science projects.


## 💡 Why EcoScholar?**
Traditional biodiversity tools are powerful, but not always student-friendly. EcoScholar bridges the gap between raw scientific data and practical research needs. It’s designed with learners and early-stage researchers in mind, giving them a simplified way to:
- Search for species by name (common or scientific)
- Get meaningful summaries instead of overwhelming tables
- Save important species with notes
- Export research in a clean, formatted PDF
- Visualize global distribution without GIS software

EcoScholar is your research assistant in the browser — fast, free, and focused on learning.

## ⚙️ Installation & Setup

**✅ Prerequisites**
Before installing, ensure you have the following installed:
- Node.js (v18 or higher recommended)
- npm (comes with Node.js)
- A modern web browser (e.g., Chrome, Firefox)
- Internet connection (for API access)

**1. Clone the repository**

```bash
git clone https://github.com/Oluwasanmij2r4/EcoScholar
```

**2. Set up Openrouter key:**

Get an API key from [Openrouter](https://openrouter.ai/)

**3. Set Up Environment Variables**

Create a .env file in the root directory and add your openrouter api key:

```
VITE_X_RAPID_API_KEY=your_x_rapid_api_key
```

**4. Install Dependencies**

```bash
npm install
```

**5. Start the development server**

```bash
npm run dev
```

## ⚙️ Tech Stack
- Frontend: [React] (https://react.dev/)
- Maps: [Leaflet.js] (https://leafletjs.com/)
- PDF: [jsPDF]
- APIs:
- [GBIF Species & Occurrence API](https://www.gbif.org/developer) For classification and mapping 
- [iNaturalist Taxa API](https://api.inaturalist.org/v1/docs) For resolving species names and images 
- [Openrouter API](https://openrouter.ai/)For AI-generated species summaries
- Storage: [localStorage] (browser-based)

## 🧑‍💻 Collaborators

- [Oluwasanmi Oluwafemi](https://github.com/Oluwasanmij2r4/)

## 🔗 Links
- [Live Demo](https://eco-scholar-1h6g.vercel.app/) 

- [Demo Video](https://drive.google.com/file/d/1iPDSo-HGLqobvnDMSbpd1HfrI6q5eYg5/view?usp=drive_link)

- 📁 Source files: Available in the [GitHub Repository](https://github.com/Oluwasanmij2r4/EcoScholar)

- 🗨️ Discord: [@Loverboi9788](https://discordapp.com/users/loverboi9788)


This project is licensed under **MIT LICENSE**. See the [LICENSE](https://choosealicense.com/licenses/mit/) file for details.
