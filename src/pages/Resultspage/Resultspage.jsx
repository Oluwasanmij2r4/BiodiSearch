import styles from "./resultspage.module.css";
import { React, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { FaSearch as Searchicon } from "react-icons/fa";
import Button from "../../components/Button/Button";
import {parseQuery} from "../../utils/parseQuery"
import { fetchFromINaturalist, fetchConservationStatus } from "../../api/inaturalist";
import { fetchSpeciesFromGBIF, fetchOccurrenceCount } from "../../api/gbifapi";
import { i } from "motion/react-client";



const ResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

 const query = new URLSearchParams(location.search).get("query");
 const [species, setSpecies] = useState([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);

 
// const fetchImageFromWikimedia = async (speciesName) => {
//   // Prepare the search term
//   const searchTerm = speciesName.trim();

//   // Use Wikipedia's API instead (which has better CORS support with origin=*)
//   const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&titles=${encodeURIComponent(
//     searchTerm
//   )}&piprop=original&origin=*`;

//   try {
//     const response = await fetch(apiUrl);
//     const data = await response.json();

//     console.log("Wikipedia API response:", data);

//     // Extract the page ID from the response
//     const pages = data.query.pages;
//     const pageId = Object.keys(pages)[0];

//     // Check if we got an image
//     if (
//       pages[pageId] &&
//       pages[pageId].original &&
//       pages[pageId].original.source
//     ) {
//       return pages[pageId].original.source;
//     }

//     // If no image with pageimages, try another approach with image search
//     const imageSearchUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=${encodeURIComponent(
//       searchTerm
//     )}&srnamespace=6&srlimit=1&origin=*`;

//     const imageResponse = await fetch(imageSearchUrl);
//     const imageData = await imageResponse.json();

//     if (imageData.query.search && imageData.query.search.length > 0) {
//       const imageTitle = imageData.query.search[0].title;
//       return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(
//         imageTitle
//       )}?width=300`;
//     }

//     return null;
//   } catch (error) {
//     console.error("Error fetching image from Wikipedia:", error);
//     return null;
//   }
// };


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

        setSpecies([
          {
            id: speciesData.taxonKey,
            scientificName: speciesData.scientificName,
            commonName: iNaturalistData.commonName,
            extinct: extinctData,
            rank: speciesData.rank || "Unknown",
            kingdom: speciesData.kingdom || "Unknown",
            occurrenceCount: occurrences,
            authority: conservationStatus.authority,
            status: conservationStatus.status,
            statusName: conservationStatus.statusName,
            imageUrl:
              speciesImageUrl ||
              `https://source.unsplash.com/random/300x200/?${scientificName.toLowerCase()}`,
            gbifLink: speciesData.gbifLink,
          },
        ]);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching species data:", err);
        setError("Error fetching data");
        setLoading(false);
      }
    };
    

  

    fetchSpeciesData();
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

          </div>
        </div>
      </div>

      <div className={styles.loadingState} >
        {loading && <p className={styles.loading} ></p>}
        {error && <p>{error}</p>}
      </div>

      <div>
        {!loading && !error && species.length > 0 && (
          <div>
            {species.map((item) => (
              <div key={item.id} className={styles.speciesCard}>
                <div>
                  {item.imageUrl && (
                    <img src={item.imageUrl} alt={item.scientificName} />
                  )}
                </div>
                <h1 className={styles.text}>Common Name: {item.commonName}</h1>
                <h2 className={styles.text}>
                  Scientific Name: {item.scientificName}
                </h2>

                <p className={styles.text}>
                  Extinct:{" "}
                  {item.extinct === true ? (
                    <span> Yes</span>
                  ) : item.extinct === false ? (
                    <span>No</span>
                  ) : (
                    <span>Unknown</span>
                  )}
                </p>
                <p className={styles.text}>{item.rank}</p>
                <p className={styles.text}>{item.kingdom}</p>
                <p className={styles.text}>Occurence:{item.occurrenceCount}</p>
                <p className={styles.text}>Authority:{item.authority}</p>
                <p className={styles.text}>
                  Status: {item.status} : {item.statusName}
                </p>

                <a
                  href={item.gbifLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on GBIF
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultPage;
