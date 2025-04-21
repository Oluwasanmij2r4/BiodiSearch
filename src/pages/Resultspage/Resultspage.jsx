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
  applyStylesToSummary,
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

  useEffect(() => {
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


        setSpecies(
          {
            id: speciesData.taxonKey,
            scientificName: speciesData.scientificName,
            commonName: iNaturalistData.commonName,
            family: speciesData.family,
            extinct: extinctData,
            rank: speciesData.rank || "Unknown",
            kingdom: speciesData.kingdom || "Unknown",
            occurrenceCount: occurrences,
            authority: conservationStatus.authority,
            statusName: conservationStatus.statusName,
            imageUrl:
              speciesImageUrl ||
              `https://source.unsplash.com/random/300x200/?${scientificName.toLowerCase()}`,
            gbifLink: speciesData.gbifLink,
          },
        );
        setLoading(false);
      } catch (err) {
        console.error("Error fetching species data:", err);
        setError("Error fetching data");
        setLoading(false);
      }
    };
    

  

    fetchSpeciesData();
  }, [query, navigate]);

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


    if (result){
      const styleSummary = applyStylesToSummary(result)
      localStorage.setItem(key, result)
      setAiSummary(styleSummary)
      setExpanded(true);
    }
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
              <div>
                {species.imageUrl && (
                  <img src={species.imageUrl} alt={species.scientificName} />
                )}
              </div>
              <h1 className={styles.text}>Common Name: {species.commonName}</h1>
              <h2 className={styles.text}>
                Scientific Name: {species.scientificName}
              </h2>

              <p className={styles.text}>
                Extinct:{" "}
                {species.extinct === true ? (
                  <span> Yes</span>
                ) : species.extinct === false ? (
                  <span>No</span>
                ) : (
                  <span>Unknown</span>
                )}
              </p>
              <p className={styles.text}>Rank: {species.rank}</p>
              <p className={styles.text}>Kingdom: {species.kingdom}</p>
              <p className={styles.text}>Family: {species.family}</p>
              <p className={styles.text}>
                Occurence Count:{species.occurrenceCount}
              </p>
              <p className={styles.text}>Authority:{species.authority}</p>
              <p className={styles.text}>
                Status: {species.statusName}
              </p>

              <a
                href={species.gbifLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                View on GBIF
              </a>
            </div>

            <div className={styles.summaryCard}>
              {/* ... your existing species info display ... */}

              <h3>Summary</h3>
              <p>{generateSpeciesSummary(species)}</p>

              {!expanded && (
                <button onClick={handleReadMore} disabled={summaryLoading}>
                  {summaryLoading ? "Loading..." : "Get Ai-Summary"}
                </button>
              )}

              {expanded && aiSummary && (
                <div>
                  <p>{aiSummary}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultPage;
