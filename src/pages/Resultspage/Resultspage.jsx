import styles from "./resultspage.module.css";
import { React, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { FaSearch as Searchicon } from "react-icons/fa";
import Button from "../../components/Button/Button";
import { fetchFromINaturalist, fetchConservationStatus } from "../../api/inaturalist";
import { fetchSpeciesFromGBIF, fetchOccurrenceCount } from "../../api/gbifapi";
import {
  generateSpeciesSummary,
  abstractSummary
} from "../../utils/summary";
import { fetchAiSummary } from "../../api/ai";
import { i } from "motion/react-client";



const ResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
 const [species, setSpecies] = useState(null);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);
 const [expanded, setExpanded] = useState(false)
 const [aiSummary, setAiSummary] = useState(null)
 const [summaryLoading, setSummaryLoading] = useState(false);

 
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
    if (!query) {
      alert("❌ No search query found...");
      navigate("/");
      return;
    }

    const fetchSpeciesData = async () =>{
     setLoading(true);
     

      try {
        const iNaturalistData = await fetchFromINaturalist(query);

        const conservationStatus = await fetchConservationStatus(query)

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

        const extinctData = iNaturalistData.extinct !== undefined ? iNaturalistData.extinct : "Unknown";


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

  useEffect (() => {
    setExpanded(false);
    setAiSummary(null);
  }, [species?.scientificName]);

  const handleReadMore = async () => {
    const key = `ai-summary-${species.scientificName}`;
    const cached = localStorage.getItem(key);

    if (cached){
      setAiSummary(cached)
      setExpanded(true)
      return;
    }

    setSummaryLoading(true)
    const result = await fetchAiSummary(species);
    setSummaryLoading(false);


 
  }


  


  return (
    <div className={styles.resultsPageWrapper}>
      <div className={styles.header}>
        <Navbar />
      </div>

      <div className={styles.resultsPageContent}>
        <div className={styles.resultsPage}>
          <div className={styles.searchResults}>
            <div className={styles.searchResultsHeader}>
              <Searchicon className={styles.searchIcon} />
              <h2 className={styles.searchText}>Search Results For: {query}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.loadingState}>
        {loading && <p className={styles.loading}></p>}
        {error && <p>{error}</p>}
      </div>

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
                <div className={styles.speciesSideDetails}>
                  <h1 className={styles.commonName}>{species.commonName}</h1>
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

              <p className={styles.text}>
                Occurence Count:{species.occurrenceCount}
              </p>
              <p className={styles.text}>Authority:{species.authority}</p>
              <p className={styles.text}>Status: {species.statusName}</p>

              <a
                href={species.gbifLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                View on GBIF
              </a>
            </div>

            <div className={styles.taxonomy}>
              <table>
                <caption>TAXONOMY</caption>

                <tbody className={styles.taxonomyTableTop}>
                  <tr className={styles.row}>
                    <td>KINGDOM</td>
                    <td>PHYLUM</td>
                    <td>CLASS</td>
                  </tr>

                  <tr className={styles.row2}>
                    <th>{species.kingdom}</th>
                    <th>{species.phylum}</th>
                    <th>{species.class}</th>
                  </tr>
                </tbody>

                <tbody className={styles.taxonomyTableLow}>
                  <tr className={styles.row}>
                    <td>ORDER</td>
                    <td>FAMILY</td>
                    <td>GENUS</td>
                  </tr>

                  <tr className={styles.row2}>
                    <th>{species.order}</th>
                    <th>{species.family}</th>
                    <th>{species.genus}</th>
                  </tr>
                </tbody>
              </table>
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

                  <Button
                    onClick={() => setExpanded(false)}
                    text="Close"
                  />
                </div>
              )}

              <div></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultPage;
