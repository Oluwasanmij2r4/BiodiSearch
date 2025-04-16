import styles from "./resultspage.module.css";
import { React, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { FaSearch as Searchicon } from "react-icons/fa";
import Button from "../../components/Button/Button";
import { parseQueryFilters } from "../../utils/Queryparser/queryParser";

const ResultPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [speciesResults, setSpeciesResults] = useState([]);
  const query = searchParams.get("query");

  // Fetch image for each species from iNaturalist API
  const fetchSpeciesImage = async (speciesName) => {
    try {
      const response = await fetch(
        `https://api.inaturalist.org/v1/search?q=${speciesName}&sources=taxa`
      );
      const data = await response.json();

      const photoUrl = data?.results?.[0]?.record?.default_photo?.medium_url;
      return photoUrl || null;
    } catch (error) {
      console.error("Failed to fetch iNaturalist image", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchSpecies = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://api.gbif.org/v1/species/search?q=${query}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch species data");
        }

        const data = await response.json();
        const uniqueSpeciesMap = new Map();

        // Iterate over the results and store unique species by canonicalName
        for (let species of data.results) {
          // Check if species already exists in the map by canonicalName
          if (!uniqueSpeciesMap.has(species.canonicalName)) {
            const imageURL = await fetchSpeciesImage(species.canonicalName);

            uniqueSpeciesMap.set(species.canonicalName, {
              ...species,
              imageURL: imageURL || "https://via.placeholder.com/150", // Fallback image
            });
          }
        }

        // Convert map to array for final species results
        setSpeciesResults(Array.from(uniqueSpeciesMap.values()));
      } catch (err) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchSpecies();
    }
  }, [query]);


  useEffect(() => {
    if (!query) {
      alert("❌ No search query found...");
      navigate("/");
    }
  }, [query, navigate]);

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

            <div className={styles.searchResultsFilter}>
              <div className={styles.inputWrapper}>
                <input
                  type="text"
                  placeholder="Species"
                  className={styles.searchInput}
                />
                <input
                  type="text"
                  placeholder="Location"
                  className={styles.searchInput}
                />
              </div>

              <Button text="Filter" />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.resultsContainer}>
        {loading && <p>Loading species data...</p>}
        {error && <p>Error: {error}</p>}
        {!loading && !error && speciesResults.length === 0 && (
          <p>No species found for "{query}"</p>
        )}

        <div className={styles.speciesGrid}>
          {speciesResults.map((species) => (
            <div key={species.key} className={styles.speciesCard}>
              {species.imageURL ? (
                <img
                  src={species.imageURL}
                  alt={species.canonicalName}
                  className={styles.speciesImage}
                />
              ) : (
                <div className={styles.imagePlaceholder}>No Image</div>
              )}
              <h3>{species.canonicalName || "Unnamed species"}</h3>
              <p>
                <i>{species.scientificName}</i>
              </p>
              <p>Rank: {species.rank}</p>
              <p>Kingdom: {species.kingdom}</p>
              <p>Family: {species.family}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
