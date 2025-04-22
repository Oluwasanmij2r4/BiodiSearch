import styles from "./speciescard.module.css";
import { React, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { FaSearch as Searchicon } from "react-icons/fa";
import Button from "../../components/Button/Button";
import {
  fetchFromINaturalist,
  fetchConservationStatus,
} from "../../api/inaturalist";
import { fetchSpeciesFromGBIF, fetchOccurrenceCount } from "../../api/gbifapi";
import { generateSpeciesSummary, abstractSummary } from "../../utils/summary";
import { fetchAiSummary } from "../../api/ai";
import Savespecies from "../Savespecies/Savespecies";
import { reportToPdf } from "../../utils/pdfExport";
import SpeciesMap from "../Speciesmap/Speciesmap";
import { i } from "motion/react-client";

const Speciescard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [species, setSpecies] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [aiSummary, setAiSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
const [selectedSpecies, setSelectedSpecies] = useState(null);
const handleOpenSaveModal = (species) => {
  setSelectedSpecies(species);
  setIsSaveModalOpen(true);
};

  const query = new URLSearchParams(location.search).get("query");
  const mockData = {
    id: 123456,
    scientificName: "Panthera leo",
    commonName: "Lion",
    family: "Felidae",
    extinct: false,
    rank: "Species",
    kingdom: "Animalia",
    phylum: "Chordata",
    class: "Mammalia",
    order: "Carnivora",
    genus: "Panthera",
    occurrenceCount: 98000,
    authority: "IUCN",
    statusName: "Vulnerable",
    imageUrl:
      "https://plus.unsplash.com/premium_photo-1664304310991-b43610000fc2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8bGlvbnxlbnwwfHwwfHx8MA%3D%3D",
    gbifLink: "https://www.gbif.org/species/5219408",
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const useMock = params.get("mock") === "true";
    

    const fetchSpeciesData = async () => {
      setLoading(true);

      try {
        const iNaturalistData = await fetchFromINaturalist(query);

        const conservationStatus = await fetchConservationStatus(query);

        if (!iNaturalistData || !iNaturalistData.scientificName) {
          setError("Species not found in iNaturalist.");
          setLoading(false);
          return;
        }

        const scientificName = iNaturalistData.scientificName;

        const speciesData = await fetchSpeciesFromGBIF(scientificName);
        if (!speciesData) {
          setError("Species not found.");
          setLoading(false);
          return;
        }

        const occurrences = await fetchOccurrenceCount(speciesData.taxonKey);

        // console.log(conservationStatus)

        const speciesImageUrl = iNaturalistData?.imageUrl || null;

        const extinctData =
          iNaturalistData.extinct !== undefined
            ? iNaturalistData.extinct
            : "Unknown";

        setSpecies({
          id: speciesData.taxonKey,
          scientificName: speciesData.scientificName,
          commonName: iNaturalistData.commonName,
          family: speciesData.family,
          extinct: extinctData,
          rank: speciesData.rank || "Unknown",
          kingdom: speciesData.kingdom || "Unknown",
          phylum: speciesData.phylum || "Unknown",
          class: speciesData.class || "Unknown",
          order: speciesData.order || "Unknown",
          genus: speciesData.genus || "Unknown",
          occurrenceCount: occurrences,
          authority: conservationStatus.authority,
          statusName: conservationStatus.statusName,
          imageUrl:
            speciesImageUrl ||
            `https://source.unsplash.com/random/300x200/?${scientificName.toLowerCase()}`,
          gbifLink: speciesData.gbifLink,
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching species data:", err);
        setError("Error fetching data");
        setLoading(false);
      }
    };

    if (useMock) {
      setSpecies(mockData);
      setLoading(false);
      return;
    }

    fetchSpeciesData();
  }, [query, location.search, navigate]);

  useEffect(() => {
    setExpanded(false);
    setAiSummary(null);
  }, [species?.scientificName]);

  const handleReadMore = async () => {
    const key = `ai-summary-${species.scientificName}`;
    const cached = localStorage.getItem(key);

    if (cached) {
      setAiSummary(cached);
      setExpanded(true);
      return;
    }

    setSummaryLoading(true);
    const result = await fetchAiSummary(species);
    setSummaryLoading(false);

     if (result) {
       setAiSummary(result);
       setExpanded(true);
       localStorage.setItem(key, result); // Cache it
     } else {
       setAiSummary("Sorry, we couldn't generate a summary at the moment.");
     }
  };

  const handleDownloadReport = async () => {
    const speciesList = [species]; 
   await reportToPdf(speciesList, aiSummary); 
  };

  return (
    <div className={styles.speciesCardWrapper}>
      {(loading || error) && (
        <div className={styles.loadingState}>
          {loading && <p className={styles.loading}></p>}
          {error && <p>{error}</p>}
        </div>
      )}

      <div>
        {!loading && !error && species && (
          <div>
            <div key={species.id} className={styles.speciesCard}>
              <div className={styles.speciesCardHeader}>
                <div className={styles.speciesImageCard}>
                  {species.imageUrl && (
                    <img
                      src={species.imageUrl}
                      alt={species.scientificName}
                      className={styles.speciesImage}
                    />
                  )}
                </div>
                <div>
                  <div className={styles.saveSpecieCard}>
                    <div className={styles.saveText}> 
                      <h1 className={styles.commonName}>{species.commonName}</h1>
                    </div>
                    <div className={styles.saveButton}>
                      <Button
                        onClick={() => handleOpenSaveModal(species)}
                        text="Save Report"
                        btnClass="secondary"
                      />

                      <Button
                        onClick={handleDownloadReport}
                        text="Download Report"
                        btnClass="secondary"
                      />
                    </div>

                    <Savespecies
                      isOpen={isSaveModalOpen}
                      onClose={() => setIsSaveModalOpen(false)}
                      species={selectedSpecies}
                    />
                  </div>
                  <p className={styles.scientificName}>
                    Scientific Name: {species.scientificName} || Extinct:{" "}
                    {species.extinct === true ? (
                      <span> Yes</span>
                    ) : species.extinct === false ? (
                      <span>No</span>
                    ) : (
                      <span>Unknown</span>
                    )}
                  </p>

                  <p className={styles.abstract}>Abstract Summary</p>
                  <p className={styles.abstractText}>
                    {abstractSummary(species)}
                  </p>
                </div>
              </div>

              <div className={styles.ocurrenceData}>
                <ul>
                  <li className={styles.text}>
                    Occurence Count: {species.occurrenceCount}
                  </li>
                  <li className={styles.text}>
                    Authority: {species.authority}
                  </li>
                  <li className={styles.text}>Status: {species.statusName}</li>
                  <li>
                    <a
                      href={species.gbifLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View on GBIF
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className={styles.taxonomy}>
              <table>
                <caption>TAXONOMY</caption>

               
                  <tbody>
                    <tr className={styles.rowUp}>
                      <td>KINGDOM</td>
                      <td>PHYLUM</td>
                      <td>CLASS</td>
                    </tr>
                    <tr className={styles.rowMid}>
                      <th>{species.kingdom}</th>
                      <th>{species.phylum}</th>
                      <th>{species.class}</th>
                    </tr>
                    <tr className={styles.rowLow}>
                      <td>ORDER</td>
                      <td>FAMILY</td>
                      <td>GENUS</td>
                    </tr>
                    <tr className={styles.rowEnd}>
                      <th>{species.order}</th>
                      <th>{species.family}</th>
                      <th>{species.genus}</th>
                    </tr>
                  </tbody>
             
              </table>
            </div>

            <div className={styles.mapContainer} >
              <h2 className={styles.globalText} >
                🌍 Global Distribution of <em>{species.scientificName}</em>
              </h2>
              <div className={styles.mapCaad}>
                <SpeciesMap taxonKey={5219408} />
              </div>
            </div>

            <div className={styles.summaryCard}>
              {/* ... your existing species info display ... */}

              <h3>Summary</h3>
              <p className={styles.templateSummary}>
                {generateSpeciesSummary(species)}
              </p>

              {!expanded && (
                <Button
                  onClick={handleReadMore}
                  disabled={summaryLoading}
                  text={summaryLoading ? "Loading..." : "Get Ai-Summary"}
                />
              )}

              {expanded && aiSummary && (
                <div>
                  <p className={styles.aiSummary}>{aiSummary}</p>

                  <Button onClick={() => setExpanded(false)} text="Close" />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Speciescard;