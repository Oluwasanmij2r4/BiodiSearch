import styles from "./resultspage.module.css";
import { React, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { FaSearch as Searchicon } from "react-icons/fa";
import Button from "../../components/Button/Button";
import {fetchSpecies} from "../../api/gbifapi"
import {parseQuery} from "../../utils/parseQuery"



const ResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

 const query = new URLSearchParams(location.search).get("query");
 const [species, setSpecies] = useState([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);

 
const fetchImageFromWikimedia = async (speciesName) => {
  // Prepare the search term
  const searchTerm = speciesName.trim();

  // Use Wikipedia's API instead (which has better CORS support with origin=*)
  const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&titles=${encodeURIComponent(
    searchTerm
  )}&piprop=original&origin=*`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    console.log("Wikipedia API response:", data);

    // Extract the page ID from the response
    const pages = data.query.pages;
    const pageId = Object.keys(pages)[0];

    // Check if we got an image
    if (
      pages[pageId] &&
      pages[pageId].original &&
      pages[pageId].original.source
    ) {
      return pages[pageId].original.source;
    }

    // If no image with pageimages, try another approach with image search
    const imageSearchUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=${encodeURIComponent(
      searchTerm
    )}&srnamespace=6&srlimit=1&origin=*`;

    const imageResponse = await fetch(imageSearchUrl);
    const imageData = await imageResponse.json();

    if (imageData.query.search && imageData.query.search.length > 0) {
      const imageTitle = imageData.query.search[0].title;
      return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(
        imageTitle
      )}?width=300`;
    }

    return null;
  } catch (error) {
    console.error("Error fetching image from Wikipedia:", error);
    return null;
  }
};


  useEffect(() => {
    if (!query) {
      alert("❌ No search query found...");
      navigate("/");
      return;
    }

    const fetchSpeciesData = async () =>{
     setLoading(true);

      try {
        const parsed = parseQuery(query);
        console.log("Parsed query:", parsed); // check if q exists

        const data = await fetchSpecies({ ...parsed, originalQuery: query });

        const simplifiedData = await Promise.all(
          data.map(async (species) => {
            const speciesImageUrl = await fetchImageFromWikimedia(
              species.scientificName || species.canonicalName
            );

            return {
              id: species.key,
              scientificName: species.scientificName || "Unknown",
              canonicalName: species.canonicalName || "Unknown",
              Habitats:
                Array.isArray(species.habitats) && species.habitats.length > 0
                  ? species.habitats
                      .map((habitat) => habitat.toLowerCase())
                      .join(", ")
                  : "Unknown",
              rank: species.rank || "Unknown",
              imageUrl:
                speciesImageUrl ||
                `https://source.unsplash.com/random/300x200/?${
                  species.class?.toLowerCase() ||
                  species.kingdom?.toLowerCase() ||
                  "species"
                }`,
            };
          })
        );

        setSpecies(simplifiedData);
        setLoading(false);
      } catch (err) {
        setError("Error fetching data")
        setLoading(false)
      }
    };

    // const fetchSpeciesData = async () => {
    //   setLoading(true);

    //   try {
    //     setTimeout(() =>{
    //       const mockData = [
    //          {
    //           id: 1,
    //           commonName: "Bengal Tiger",
    //           scientificName: "Panthera tigris tigris",
    //           conservationStatus: "Endangered",
    //           population: "Less than 2,500",
    //           habitat: "Forests of India, Bangladesh, and Nepal",
    //           threats: ["Poaching", "Habitat loss", "Human conflict"],
    //           imageUrl: "https://source.unsplash.com/random/300x200/?tiger"
    //         },
    //         {
    //           id: 2,
    //           commonName: "Black Rhino",
    //           scientificName: "Diceros bicornis",
    //           conservationStatus: "Critically Endangered",
    //           population: "About 5,500",
    //           habitat: "Eastern and Southern Africa",
    //           threats: ["Poaching", "Habitat loss"],
    //           imageUrl: "https://source.unsplash.com/random/300x200/?rhino"
    //         },
    //         {
    //           id: 3,
    //           commonName: "Mountain Gorilla",
    //           scientificName: "Gorilla beringei beringei",
    //           conservationStatus: "Endangered",
    //           population: "Around 1,000",
    //           habitat: "Forests of Central Africa",
    //           threats: ["Habitat destruction", "Poaching", "Disease"],
    //           imageUrl: "https://source.unsplash.com/random/300x200/?gorilla"
    //         },
    //         {
    //           id: 4,
    //           commonName: "Blue Whale",
    //           scientificName: "Balaenoptera musculus",
    //           conservationStatus: "Endangered",
    //           population: "10,000-25,000",
    //           habitat: "Oceans worldwide",
    //           threats: ["Ship strikes", "Entanglement in fishing gear", "Noise pollution"],
    //           imageUrl: "https://source.unsplash.com/random/300x200/?whale"
    //         },
    //         {
    //           id: 5,
    //           commonName: "Hawksbill Turtle",
    //           scientificName: "Eretmochelys imbricata",
    //           conservationStatus: "Critically Endangered",
    //           population: "Unknown",
    //           habitat: "Tropical oceans worldwide",
    //           threats: ["Poaching", "Bycatch", "Habitat destruction"],
    //           imageUrl: "https://source.unsplash.com/random/300x200/?turtle"
    //         },
    //         {
    //           id: 6,
    //           commonName: "Giant Panda",
    //           scientificName: "Ailuropoda melanoleuca",
    //           conservationStatus: "Vulnerable",
    //           population: "Around 1,800",
    //           habitat: "Bamboo forests of China",
    //           threats: ["Habitat fragmentation", "Low reproductive rate"],
    //           imageUrl: "https://source.unsplash.com/random/300x200/?panda"
    //         }
    //       ];

    //       setSpecies(mockData);
    //       setLoading(false);
    //     }, 1500);
    //   } catch(err){
    //     if(err.message){
    //       setError(err.message) 
    //     } else {
    //       alert("❌ Error fetching species data...")
    //     };
    //     setLoading(false);
    //   }
    // }

    fetchSpeciesData();
  }, [query, navigate]);


  // const handleSpeciesClick = (speciesId) => {
  //   navigate(`/species/${speciesId}`);
  // };


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

      {species.length > 0 ? (
        <div className={styles.speciesList}>
          {species.map((item) => (
            <div key={item.id} className={styles.speciesCard}>
              <div className={styles.speciesImageWrapper}>
                <img
                  src={item.imageUrl}
                  alt={item.scientificName}
                  className={styles.speciesImage}
                />
              </div>

              <h1 className={styles.speciesName}>{item.scientificName}</h1>

              <p className={styles.speciesDetails}>
                Canonical Name: {item.canonicalName}
              </p>

              <p className={styles.speciesconserv}>
                Habitats: {item.Habitats}
              </p>

              <p className={styles.speciesRank}>
                Rank Status: {item.rank}
              </p>
            </div>
          ))}
        </div>
      ) : loading ? (
        <div className={styles.loading}>Loading...</div>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : (
        <div className={styles.noResults}>No results found.</div>
      )}
    </div>
  );
};

export default ResultPage;
